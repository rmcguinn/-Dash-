let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');
const alarm = document.querySelector('.alarmFX');
const test = document.querySelector('.timer__controls');
const clock = document.querySelector('.clock');

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);
  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);
  displayEndTime(then);

  // Runs the clock function when there isn't a timer running

  // if (secondsLeft < 0) { 
  //   displayClock();
  // }

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // check if we should stop it!
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    } 
    else if (secondsLeft == 0) {
      console.log('DONE');
      alarm.play();
    }

    // Work In Progress for Stop Button

    if (!alarm.paused || alarm.currentTime) {
      test.style.background = 'red';
      test.style.transition = '1.6s ease';
    } 

    // Not transitioning back

    // else if (alarm.currentTime == 0) {
    //   test.style.background = "none";
    // }

    // display it
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
  document.title = display;
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  let adjustedHour = hour > 12 ? hour - 12 : hour;
  if (adjustedHour == 0) {
    adjustedHour = 12;
  }
  const minutes = end.getMinutes();
  const ampm = hour < 12 ? 'AM' : 'PM';
  endTime.textContent = `Be Back At ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}


buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const mins = this.minutes.value;
  console.log(mins);
  timer(mins * 60);
  this.reset();
});

function displayClock() {
  const now = new Date();
  const hour = now.getHours();
  let adjustedHour = hour > 12 ? hour - 12 : hour;
  if (adjustedHour == 0) {
    adjustedHour = 12;
  }
  const minutes = now.getMinutes();
  const ampm = hour < 12 ? 'AM' : 'PM';
  const refresh = setTimeout(displayClock, 500);
  if (countdown) { 
    clock.textContent = "";
  }
  else {
    clock.textContent = `${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
  }
}

displayClock();