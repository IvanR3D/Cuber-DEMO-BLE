/* TIMER */
let timerInterval;
let startTime;
let countdownInterval;
let countdownSeconds = 15;
let timerRunning = false; 
let countdownRunning = false;

// Function to start the countdown before timer
function startCountdown() {
    countdownRunning = true;
    countdownSeconds = 15; // Reset countdown duration
    countdownInterval = setInterval(updateCountdown, 1000); // Update countdown every second
    document.getElementById("timer").textContent = countdownSeconds; // Display initial countdown value
    document.getElementById("timerButton").textContent = "Inspection";
}

// Function to update the countdown display
function updateCountdown() {
    countdownSeconds--;
    if (countdownSeconds === 0) {
        clearInterval(countdownInterval);
        startTimer(); // Start the timer after countdown
    } else {
        document.getElementById("timer").textContent = countdownSeconds;
    }
}

// Function to start the timer
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 10); // Update timer every 10 milliseconds
    timerRunning = true;
    document.getElementById("timerButton").textContent = "Stop Timer";
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    document.getElementById("timerButton").textContent = "Start Timer";
}

// Function to toggle the timer start/stop
function toggleTimer() {
    
    if (!countdownRunning && !timerRunning) {
        startCountdown();
    }
    else if (countdownRunning && !timerRunning) {
        clearInterval(countdownInterval);
        countdownRunning = false;
        startTimer();
    } else {
        stopTimer();
    }
}

// Function to update the timer display
function updateTimer() {
    if (cube.isSolved()) {
        stopTimer();
        setScramble();
        scr = "";
    }
    var currentTime = Date.now();
    var elapsedTime = currentTime - startTime; // Time in milliseconds
    var minutes = Math.floor(elapsedTime / (1000 * 60));
    var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    var milliseconds = elapsedTime % 1000;
    document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}.${milliseconds < 100 ? (milliseconds < 10 ? "00" : "0") : ""}${milliseconds}`;
}

// Add your existing event listener for the space key
document.addEventListener("keyup", function(event) {
    if (event.key === " ") { // Space key
        toggleTimer();
    }
});