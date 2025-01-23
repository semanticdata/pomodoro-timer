const TIMER_TYPES = {
    POMODORO: { minutes: 25, color: '#ff6b6b' },
    SHORT_BREAK: { minutes: 5, color: '#4ecdc4' },
    LONG_BREAK: { minutes: 15, color: '#45b7af' }
};

let timer;
let minutes = TIMER_TYPES.POMODORO.minutes;
let seconds = 0;
let isRunning = false;
let isPaused = false;
let currentTimerType = 'POMODORO';
let sessionCount = 0;

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const sessionCountDisplay = document.getElementById("session-count");
const timerEndSound = document.getElementById("timer-end");
const progressRing = document.querySelector(".progress-ring");

// Timer type buttons
const pomodoroButton = document.getElementById("pomodoro");
const shortBreakButton = document.getElementById("short-break");
const longBreakButton = document.getElementById("long-break");

function updateDisplay() {
    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");
    updateProgress();
}

function updateProgress() {
    const totalSeconds = TIMER_TYPES[currentTimerType].minutes * 60;
    const currentSeconds = minutes * 60 + seconds;
    const progress = (1 - currentSeconds / totalSeconds) * 100;
    progressRing.style.background = `conic-gradient(
        ${TIMER_TYPES[currentTimerType].color} ${progress}%,
        #f0f0f0 ${progress}%
    )`;
}

function switchTimer(type) {
    currentTimerType = type;
    minutes = TIMER_TYPES[type].minutes;
    seconds = 0;
    resetTimer();

    // Update active button
    [pomodoroButton, shortBreakButton, longBreakButton].forEach(btn => {
        btn.classList.remove('active');
    });

    switch (type) {
        case 'POMODORO':
            pomodoroButton.classList.add('active');
            break;
        case 'SHORT_BREAK':
            shortBreakButton.classList.add('active');
            break;
        case 'LONG_BREAK':
            longBreakButton.classList.add('active');
            break;
    }
}

function handleTimerTypeSwitch(type) {
    if (isRunning) {
        if (confirm('Timer is currently running. Are you sure you want to switch?')) {
            clearInterval(timer);
            isRunning = false;
            isPaused = false;
            switchTimer(type);
            updateButtonStates();
            updateActiveButton(type);
        }
    } else {
        switchTimer(type);
        updateActiveButton(type);
    }
}

function updateActiveButton(type) {
    pomodoroButton.classList.toggle('active', type === 'POMODORO');
    shortBreakButton.classList.toggle('active', type === 'SHORT_BREAK');
    longBreakButton.classList.toggle('active', type === 'LONG_BREAK');
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        isPaused = false;
        startButton.textContent = "Running";
        timer = setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    timerComplete();
                } else {
                    minutes--;
                    seconds = 59;
                }
            } else {
                seconds--;
            }
            updateDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning && !isPaused) {
        clearInterval(timer);
        isPaused = true;
        isRunning = false;
        startButton.textContent = "Resume";
    }
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    minutes = TIMER_TYPES[currentTimerType].minutes;
    seconds = 0;
    startButton.textContent = "Start";
    updateDisplay();
}

function timerComplete() {
    clearInterval(timer);
    isRunning = false;
    timerEndSound.play();

    if (currentTimerType === 'POMODORO') {
        sessionCount++;
        sessionCountDisplay.textContent = sessionCount;

        // After every 4 pomodoros, take a long break
        if (sessionCount % 4 === 0) {
            switchTimer('LONG_BREAK');
        } else {
            switchTimer('SHORT_BREAK');
        }
    } else {
        switchTimer('POMODORO');
    }
}

// Event Listeners
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

pomodoroButton.addEventListener('click', () => {
    handleTimerTypeSwitch('POMODORO');
});

shortBreakButton.addEventListener('click', () => {
    handleTimerTypeSwitch('SHORT_BREAK');
});

longBreakButton.addEventListener('click', () => {
    handleTimerTypeSwitch('LONG_BREAK');
});

// Initialize display
updateDisplay();
