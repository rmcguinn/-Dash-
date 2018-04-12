let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');
const alarm = document.querySelector('.alarmFX');
const test = document.querySelector('.timer__controls');
const clock = document.querySelector('.clock');
const dateSelector = document.querySelector('.date');
const weatherSelector = document.querySelector('.weather');
const iconSelector = document.querySelector('.weatherIcon');
let weather;

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
    timerDisplay.style.margin = '0';
  }
  else {
    clock.textContent = `${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
  }
}

displayClock();



// Date Stuff

function todaysDate() {
  let bacon = new Date();
  let date = bacon.getDate();
  let day = bacon.getDay() + 1;
  
  if (day == 1) day = 'Sunday';
  else if (day == 2) day = 'Monday';
  else if (day == 3) day = 'Tuesday';
  else if (day == 4) day = 'Wednesday';
  else if (day == 5) day = 'Thursday';
  else if (day == 6) day = 'Friday';
  else if (day == 7) day = 'Saturday';
  
  let month = bacon.getMonth() + 1;
  
  if (month == 1) month = 'January';
  else if (month == 2) month = 'February';
  else if (month == 3) month = 'March';
  else if (month == 4) month = 'April';
  else if (month == 5) month = 'May';
  else if (month == 6) month = 'June';
  else if (month == 7) month = 'July';
  else if (month == 8) month = 'August';
  else if (month == 9) month = 'September';
  else if (month == 10) month = 'October';
  else if (month == 11) month = 'November';
  else if (month == 12) month = 'December';

  console.log('Today is ' + day + ' ' + month + ' ' + date + 'th');
  dateSelector.textContent = day + ' ' + month + ' ' + date + 'th';
}

todaysDate();





// Weather Stuff

function readJSON(file) {
  const request = new XMLHttpRequest();
  request.open('GET', file, false);
  request.send(null);
  if (request.status == 200)
    return request.responseText;
};

function weatherCenter() {
  weather = JSON.parse(readJSON('http://api.openweathermap.org/data/2.5/forecast?id=5809844&APPID=4ed5e89afca7527f724a4768d95de224&units=imperial'));
  let today = Math.round(weather.list[0].main.temp);
  let city = weather.city.name;
  let desc = weather.list[0].weather[0].main;
  let weatherCode = 600;
  let icon = 'wi-owm-' + weatherCode;
  if (weatherCode) iconSelector.classList.add(icon);
  weatherSelector.textContent = today + '°' + ' F and ' + desc + 'ing';
  console.log('Current Weather in ' + city + ' is ' + today + '°' + ' F and ' + desc + 'ing');
  setTimeout(weatherCenter, 60000);
};

weatherCenter();
