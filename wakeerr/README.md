# Wakeerr - Wake up a little smarter

Wakeerr is an innovative alarm clock app that requires users to complete trivia challenges before the alarm stops. This approach helps wake up your brain and get you thinking early in the morning.

## Features

### 🎯 Core Functionality
- **Smart Alarm System**: Set alarms that require trivia challenges to be solved before stopping
- **Trivia Challenges**: Multiple-choice questions from various categories and difficulty levels
- **Difficulty Levels**: Easy (Baby), Normal, Hard, and Genius
- **Topic Selection**: Choose from Science, History, Movies, Music, Sports, Literature, and more

### 🧠 Brain Training
- **Daily Challenges**: Start each day with mental stimulation
- **Progress Tracking**: Monitor your improvement over time
- **Streak System**: Build consecutive correct answer streaks
- **Performance Analytics**: View detailed statistics and accuracy rates

### 🏆 Social Features
- **Leaderboards**: Compete with friends and see rankings
- **User Profiles**: Track personal achievements and progress
- **Difficulty Filters**: Compare performance across different challenge levels
- **Search & Filter**: Find specific users or filter by time periods

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Beautiful Interface**: Clean, modern design with smooth animations
- **Intuitive Navigation**: Easy-to-use interface for all age groups
- **Accessibility**: Designed with accessibility in mind

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Local Storage + JavaScript
- **API Integration**: Open Trivia Database (OpenTDB)

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd wakeerr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

1. **Create production build**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

## Project Structure

```
wakeerr/
├── src/
│   ├── index.html          # Main landing page
│   ├── Sign-Up.html        # User registration and login
│   ├── Quiz.html           # Interactive quiz interface
│   ├── Rankings.html       # Leaderboards and user rankings
│   ├── main.js             # Core application logic
│   ├── style.css           # Tailwind CSS and custom styles
│   └── assets/             # Images and other assets
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # This file
```

## How It Works

### 1. Alarm Setting
- Users set an alarm time using the time picker
- Choose difficulty level for the morning challenge
- Select preferred topics for trivia questions

### 2. Morning Challenge
- When the alarm goes off, it plays a sound
- A trivia question modal appears
- Users must answer correctly to stop the alarm
- Wrong answers require retrying

### 3. Progress Tracking
- All challenge attempts are recorded
- Statistics include accuracy, streaks, and difficulty breakdown
- Performance is tracked over time

### 4. Social Competition
- Users can view leaderboards
- Compare scores with friends
- Filter rankings by difficulty and time period

## Configuration

### Tailwind CSS
The app uses Tailwind CSS for styling. Custom colors and animations are defined in `tailwind.config.js`.

### Vite
Vite is configured for fast development with hot module replacement. Configuration is in `vite.config.js`.

### Local Storage
User data, statistics, and preferences are stored locally in the browser using localStorage.

## Customization

### Adding New Topics
1. Edit the topic buttons in `index.html`
2. Update the topic selection logic in `main.js`
3. Add corresponding trivia questions

### Modifying Difficulty Levels
1. Update difficulty options in the HTML files
2. Modify the scoring system in `main.js`
3. Adjust the difficulty-based question generation

### Styling Changes
1. Modify `style.css` for custom styles
2. Update `tailwind.config.js` for theme changes
3. Use Tailwind utility classes in HTML files

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
- Email: example@gmail.com
- Phone: 080-123-4567

## Acknowledgments

- Open Trivia Database (OpenTDB) for trivia questions
- Tailwind CSS team for the amazing styling framework
- Vite team for the fast build tool

---

**Wakeerr** - Making mornings smarter, one trivia question at a time! 🧠⏰
