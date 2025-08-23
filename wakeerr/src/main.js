// Wakeerr App - Main JavaScript File
import './style.css'

// Global state
let appState = {
  currentUser: null,
  alarmTime: null,
  alarmTimeout: null,
  isAlarmActive: false,
  currentTrivia: null,
  userStats: {},
  selectedTopics: [],
  difficulty: 'normal'
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initializeApp()
  loadUserData()
  startClock()
  setupEventListeners()
})

// App initialization
function initializeApp() {
  // Check if user is logged in
  const savedUser = localStorage.getItem('wakeerr_user')
  if (savedUser) {
    appState.currentUser = JSON.parse(savedUser)
    updateUIForUser()
  }
  
  // Load user statistics
  const savedStats = localStorage.getItem('wakeerr_stats')
  if (savedStats) {
    appState.userStats = JSON.parse(savedStats)
  }
  
  // Load selected topics
  const savedTopics = localStorage.getItem('wakeerr_topics')
  if (savedTopics) {
    appState.selectedTopics = JSON.parse(savedTopics)
  }
}

// Clock functionality
function startClock() {
  updateClock()
  setInterval(updateClock, 1000)
}

function updateClock() {
  const clockElement = document.getElementById('clock')
  if (clockElement) {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    clockElement.textContent = `${hours}:${minutes}:${seconds}`
  }
}

// Alarm system
function setAlarm() {
  const timeInput = document.getElementById('alarmTime')
  const statusElement = document.getElementById('alarmStatus')
  
  if (!timeInput || !statusElement) return
  
  // Clear existing alarm
  if (appState.alarmTimeout) {
    clearTimeout(appState.alarmTimeout)
    appState.alarmTimeout = null
  }

  const time = timeInput.value
  if (!time) {
    showNotification('Please set a valid time for the alarm!', 'error')
    return
  }

  const [hours, minutes] = time.split(':')
  const now = new Date()
  const alarmDate = new Date()
  alarmDate.setHours(parseInt(hours))
  alarmDate.setMinutes(parseInt(minutes))
  alarmDate.setSeconds(0)

  // If alarm time is earlier than current time, set it for next day
  if (alarmDate < now) {
    alarmDate.setDate(alarmDate.getDate() + 1)
  }

  const timeToAlarm = alarmDate - now
  appState.alarmTimeout = setTimeout(triggerAlarm, timeToAlarm)
  appState.alarmTime = time

  statusElement.textContent = `Alarm set for ${time}`
  statusElement.className = 'text-xl mb-8 text-green-600'
  
  showNotification(`Alarm set for ${time}`, 'success')
  
  // Save alarm to localStorage
  localStorage.setItem('wakeerr_alarm', JSON.stringify({
    time: time,
    timestamp: alarmDate.getTime()
  }))
}

function triggerAlarm() {
  appState.isAlarmActive = true
  const alarmSound = document.getElementById('alarmSound')
  
  if (alarmSound) {
    alarmSound.play()
  }
  
  // Show trivia challenge modal
  showTriviaChallenge()
  
  // Update UI to show alarm is active
  updateAlarmUI()
}

function stopAlarm() {
  appState.isAlarmActive = false
  const alarmSound = document.getElementById('alarmSound')
  
  if (alarmSound) {
    alarmSound.pause()
    alarmSound.currentTime = 0
  }
  
  // Clear alarm status
  const statusElement = document.getElementById('alarmStatus')
  if (statusElement) {
    statusElement.textContent = ''
  }
  
  // Clear stored alarm
  localStorage.removeItem('wakeerr_alarm')
  
  updateAlarmUI()
}

// Trivia system
async function showTriviaChallenge() {
  const modal = document.createElement('div')
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
  modal.id = 'triviaModal'
  
  try {
    const trivia = await fetchTriviaQuestion()
    appState.currentTrivia = trivia
    
    modal.innerHTML = `
      <div class="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Wake Up Challenge!</h2>
          <p class="text-gray-600">Solve this trivia question to stop the alarm</p>
        </div>
        
        <div class="mb-6">
          <div class="bg-blue-50 p-4 rounded-lg mb-4">
            <p class="text-lg font-medium text-blue-800">${trivia.question}</p>
          </div>
          
          <div class="space-y-3">
            ${trivia.answers.map((answer, index) => `
              <button 
                onclick="submitTriviaAnswer(${index})"
                class="w-full p-4 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                ${answer}
              </button>
            `).join('')}
          </div>
        </div>
        
        <div class="text-center">
          <p class="text-sm text-gray-500">Difficulty: ${trivia.difficulty}</p>
          <p class="text-sm text-gray-500">Category: ${trivia.category}</p>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Prevent closing by clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        e.stopPropagation()
      }
    })
    
  } catch (error) {
    console.error('Error fetching trivia:', error)
    // Fallback to a simple question
    showFallbackTrivia(modal)
  }
}

async function fetchTriviaQuestion() {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple')
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const question = data.results[0]
      return {
        question: decodeHtml(question.question),
        answers: shuffleArray([
          question.correct_answer,
          ...question.incorrect_answers
        ]),
        correctAnswer: question.correct_answer,
        category: question.category,
        difficulty: question.difficulty
      }
    }
  } catch (error) {
    console.error('Error fetching from API:', error)
  }
  
  // Return fallback question if API fails
  return getFallbackTrivia()
}

function getFallbackTrivia() {
  const fallbackQuestions = [
    {
      question: "What is the capital of France?",
      answers: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
      category: "Geography",
      difficulty: "easy"
    },
    {
      question: "Which planet is known as the Red Planet?",
      answers: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars",
      category: "Science",
      difficulty: "easy"
    },
    {
      question: "What year did World War II end?",
      answers: ["1943", "1944", "1945", "1946"],
      correctAnswer: "1945",
      category: "History",
      difficulty: "medium"
    }
  ]
  
  return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)]
}

function submitTriviaAnswer(answerIndex) {
  const trivia = appState.currentTrivia
  if (!trivia) return
  
  const selectedAnswer = trivia.answers[answerIndex]
  const isCorrect = selectedAnswer === trivia.correctAnswer
  
  if (isCorrect) {
    // Correct answer - stop alarm and show success
    stopAlarm()
    showTriviaResult(true, trivia)
    
    // Update user stats
    updateUserStats(true, trivia.difficulty)
    
  } else {
    // Wrong answer - show error and continue
    showTriviaResult(false, trivia)
  }
}

function showTriviaResult(isCorrect, trivia) {
  const modal = document.getElementById('triviaModal')
  if (!modal) return
  
  const resultClass = isCorrect ? 'text-green-600' : 'text-red-600'
  const resultText = isCorrect ? 'Correct! Alarm stopped.' : 'Wrong answer. Try again!'
  
  modal.innerHTML = `
    <div class="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-4 text-center">
      <div class="mb-6">
        <h2 class="text-3xl font-bold ${resultClass} mb-2">
          ${isCorrect ? '🎉 Success!' : '❌ Try Again!'}
        </h2>
        <p class="text-xl text-gray-700">${resultText}</p>
      </div>
      
      ${!isCorrect ? `
        <div class="mb-6">
          <p class="text-lg font-medium text-gray-800">Correct answer: ${trivia.correctAnswer}</p>
          <p class="text-sm text-gray-600 mt-2">Keep trying to stop the alarm!</p>
        </div>
      ` : ''}
      
      <button 
        onclick="closeTriviaModal()"
        class="btn-primary"
      >
        ${isCorrect ? 'Continue' : 'Try Again'}
      </button>
    </div>
  `
}

function closeTriviaModal() {
  const modal = document.getElementById('triviaModal')
  if (modal) {
    modal.remove()
  }
  
  if (!appState.isAlarmActive) {
    // If alarm is not active, close modal
    return
  }
  
  // If alarm is still active, show trivia again
  showTriviaChallenge()
}

// User management
function signUp() {
  const username = document.getElementById('username')?.value
  const email = document.getElementById('email')?.value
  const password = document.getElementById('password')?.value
  
  if (!username || !email || !password) {
    showNotification('Please fill in all fields', 'error')
    return
  }
  
  // Create user object
  const user = {
    id: Date.now(),
    username,
    email,
    password: btoa(password), // Simple encoding (not secure for production)
    createdAt: new Date().toISOString()
  }
  
  // Save user
  localStorage.setItem('wakeerr_user', JSON.stringify(user))
  appState.currentUser = user
  
  // Initialize user stats
  appState.userStats[user.id] = {
    totalChallenges: 0,
    correctAnswers: 0,
    streak: 0,
    lastChallenge: null,
    difficultyStats: {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 }
    }
  }
  
  saveUserData()
  updateUIForUser()
  showNotification('Account created successfully!', 'success')
  
  // Redirect to main page
  window.location.href = 'index.html'
}

function signIn() {
  const email = document.getElementById('loginEmail')?.value
  const password = document.getElementById('loginPassword')?.value
  
  if (!email || !password) {
    showNotification('Please fill in all fields', 'error')
    return
  }
  
  // Find user (simple implementation)
  const users = JSON.parse(localStorage.getItem('wakeerr_users') || '[]')
  const user = users.find(u => u.email === email && btoa(password) === u.password)
  
  if (user) {
    appState.currentUser = user
    localStorage.setItem('wakeerr_user', JSON.stringify(user))
    updateUIForUser()
    showNotification('Welcome back!', 'success')
    window.location.href = 'index.html'
  } else {
    showNotification('Invalid credentials', 'error')
  }
}

function signOut() {
  appState.currentUser = null
  localStorage.removeItem('wakeerr_user')
  updateUIForUser()
  showNotification('Signed out successfully', 'success')
}

// User statistics
function updateUserStats(isCorrect, difficulty) {
  if (!appState.currentUser) return
  
  const userId = appState.currentUser.id
  if (!appState.userStats[userId]) {
    appState.userStats[userId] = {
      totalChallenges: 0,
      correctAnswers: 0,
      streak: 0,
      lastChallenge: null,
      difficultyStats: {
        easy: { correct: 0, total: 0 },
        medium: { correct: 0, total: 0 },
        hard: { correct: 0, total: 0 }
      }
    }
  }
  
  const stats = appState.userStats[userId]
  stats.totalChallenges++
  
  if (isCorrect) {
    stats.correctAnswers++
    stats.streak++
    
    if (stats.difficultyStats[difficulty]) {
      stats.difficultyStats[difficulty].correct++
    }
  } else {
    stats.streak = 0
  }
  
  if (stats.difficultyStats[difficulty]) {
    stats.difficultyStats[difficulty].total++
  }
  
  stats.lastChallenge = new Date().toISOString()
  
  saveUserData()
  updateStatsUI()
}

// UI updates
function updateUIForUser() {
  const user = appState.currentUser
  
  // Update navigation
  const navElement = document.querySelector('nav')
  if (navElement) {
    if (user) {
      navElement.innerHTML = `
        <a href="Quiz.html">Quiz</a>
        <a href="Rankings.html">Rankings</a>
        <span class="text-primary-600">Welcome, ${user.username}!</span>
        <button onclick="signOut()" class="text-red-600 hover:text-red-800">Sign Out</button>
      `
    } else {
      navElement.innerHTML = `
        <a href="Quiz.html">Quiz</a>
        <a href="Rankings.html">Rankings</a>
        <a href="Sign-Up.html">Sign-Up</a>
      `
    }
  }
  
  // Update stats if user is logged in
  if (user) {
    updateStatsUI()
  }
}

function updateStatsUI() {
  const user = appState.currentUser
  if (!user) return
  
  const stats = appState.userStats[user.id]
  if (!stats) return
  
  // Update stats display if it exists
  const statsElement = document.getElementById('userStats')
  if (statsElement) {
    const accuracy = stats.totalChallenges > 0 ? 
      Math.round((stats.correctAnswers / stats.totalChallenges) * 100) : 0
    
    statsElement.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-2xl font-bold text-blue-600">${stats.totalChallenges}</p>
          <p class="text-sm text-blue-800">Challenges</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-2xl font-bold text-green-600">${stats.correctAnswers}</p>
          <p class="text-sm text-green-800">Correct</p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <p class="text-2xl font-bold text-purple-600">${accuracy}%</p>
          <p class="text-sm text-purple-800">Accuracy</p>
        </div>
        <div class="bg-orange-50 p-4 rounded-lg">
          <p class="text-2xl font-bold text-orange-600">${stats.streak}</p>
          <p class="text-sm text-orange-800">Streak</p>
        </div>
      </div>
    `
  }
}

function updateAlarmUI() {
  const alarmSection = document.querySelector('#alarmSection')
  if (!alarmSection) return
  
  if (appState.isAlarmActive) {
    alarmSection.classList.add('alarm-pulse')
    alarmSection.style.borderColor = '#ef4444'
  } else {
    alarmSection.classList.remove('alarm-pulse')
    alarmSection.style.borderColor = ''
  }
}

// Utility functions
function showNotification(message, type = 'info') {
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
    type === 'error' ? 'bg-red-500 text-white' :
    type === 'success' ? 'bg-green-500 text-white' :
    'bg-blue-500 text-white'
  }`
  
  notification.textContent = message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

function decodeHtml(html) {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function saveUserData() {
  localStorage.setItem('wakeerr_stats', JSON.stringify(appState.userStats))
  localStorage.setItem('wakeerr_topics', JSON.stringify(appState.selectedTopics))
}

function loadUserData() {
  const savedStats = localStorage.getItem('wakeerr_stats')
  if (savedStats) {
    appState.userStats = JSON.parse(savedStats)
  }
  
  const savedTopics = localStorage.getItem('wakeerr_topics')
  if (savedTopics) {
    appState.selectedTopics = JSON.parse(savedTopics)
  }
}

// Event listeners setup
function setupEventListeners() {
  // Topic selection
  const topicButtons = document.querySelectorAll('[data-topic]')
  topicButtons.forEach(button => {
    button.addEventListener('click', () => {
      const topic = button.dataset.topic
      toggleTopicSelection(topic)
    })
  })
  
  // Difficulty selection
  const difficultySelect = document.getElementById('difficultySelect')
  if (difficultySelect) {
    difficultySelect.addEventListener('change', (e) => {
      appState.difficulty = e.target.value
      localStorage.setItem('wakeerr_difficulty', e.target.value)
    })
  }
}

function toggleTopicSelection(topic) {
  const index = appState.selectedTopics.indexOf(topic)
  if (index > -1) {
    appState.selectedTopics.splice(index, 1)
  } else {
    appState.selectedTopics.push(topic)
  }
  
  saveUserData()
  updateTopicUI()
}

function updateTopicUI() {
  const topicButtons = document.querySelectorAll('[data-topic]')
  topicButtons.forEach(button => {
    const topic = button.dataset.topic
    if (appState.selectedTopics.includes(topic)) {
      button.classList.add('bg-primary-500', 'text-white')
      button.classList.remove('bg-gray-500')
    } else {
      button.classList.remove('bg-primary-500', 'text-white')
      button.classList.add('bg-gray-500')
    }
  })
}

// Export functions for use in HTML
window.setAlarm = setAlarm
window.submitTriviaAnswer = submitTriviaAnswer
window.closeTriviaModal = closeTriviaModal
window.signUp = signUp
window.signIn = signIn
window.signOut = signOut
window.toggleTopicSelection = toggleTopicSelection
