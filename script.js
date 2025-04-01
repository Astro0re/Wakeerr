function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock(); // Initialize clock immediately

let alarmTime = null;
let alarmTimeout = null;
let alarmSound = null;

function setAlarm() {
    const timeInput = document.getElementById('alarmTime');
    const statusElement = document.getElementById('alarmStatus');
    
    // Clear existing alarm
    if (alarmTimeout) {
        clearTimeout(alarmTimeout);
        alarmTimeout = null;
    }

    const time = timeInput.value;
    if (!time) {
        alert('Please set a valid time for the alarm!');
        return;
    }

    const [hours, minutes] = time.split(':');
    const now = new Date();
    const alarmDate = new Date();
    alarmDate.setHours(parseInt(hours));
    alarmDate.setMinutes(parseInt(minutes));
    alarmDate.setSeconds(0);

    // If alarm time is earlier than current time, set it for next day
    if (alarmDate < now) {
        alarmDate.setDate(alarmDate.getDate() + 1);
    }

    const timeToAlarm = alarmDate - now;
    alarmTimeout = setTimeout(triggerAlarm, timeToAlarm);

    statusElement.textContent = `Alarm set for ${time}`;
}

function triggerAlarm() {
    alarmSound = document.getElementById('alarmSound');
    alarmSound.play();
    alert('Wake up! Time to solve a challenge!');
    alarmSound.pause();
    alarmSound.currentTime = 0;
    document.getElementById('alarmStatus').textContent = '';
}

// Store tasks in localStorage to persist data
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    const select = document.getElementById('taskInput');
    const selectedTopic = select.value;
    
    if (selectedTopic) {
        // Check if topic already exists
        if (tasks.some(task => task.text === selectedTopic)) {
            alert('This topic is already added!');
            return;
        }
        
        tasks.push({
            id: Date.now(),
            text: selectedTopic,
            completed: false
        });
        select.value = ''; // Reset selection
        saveTasks();
        renderTasks();
    }
}

// Toggle task completion status
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? {...task, completed: !task.completed} : task
    );
    saveTasks();
    renderTasks();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Render all tasks to the DOM
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between p-3 bg-white rounded shadow';
        li.innerHTML = `
            <div class="flex items-center">
                <input type="checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       onclick="toggleTask(${task.id})"
                       class="mr-3">
                <span class="${task.completed ? 'line-through text-gray-500' : ''}">
                    ${task.text}
                </span>
            </div>
            <button onclick="deleteTask(${task.id})" 
                    class="text-red-500 hover:text-red-700">
                Delete
            </button>
        `;
        taskList.appendChild(li);
    });
}

// Initialize tasks on page load
document.addEventListener('DOMContentLoaded', renderTasks);
