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
    alert('Wake up! Time to solve a challenge!');
    // TODO: Add trivia challenge here
    document.getElementById('alarmStatus').textContent = '';
}
