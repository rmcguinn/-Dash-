// *WIP* Add state info onto location via Coordinates from google geocoding api


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
const citySelector = document.querySelector('.location');
let weather;
let today;
const displayContainer = document.querySelector('.display_container');
const weatherContainer = document.querySelector('.weather_container');
let userLat;
let userLong;
let unitsSymbol = 'F';
let googleAPI;
let state;

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);
  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);
  displayEndTime(then);

  // Runs the clock function when there isn't a timer running

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
      alarm.volume = 0.2;
    }
    else if (secondsLeft <= 24 && secondsLeft >= 5) {
      document.body.style.background = '#fb4f4f';
      document.body.style.backgroundImage = 'url(img/checkered-pattern.png)';
      document.body.style.backgroundImage = 'url(img/checkered-pattern.png)';
      document.body.style.transition = '4s linear';
    }

    // Work In Progress for Stop Button

    if (!alarm.paused || alarm.currentTime) {
      // test.style.background = 'red';
      // test.style.transition = '1.6s ease';
    } 

    if (alarm.paused) {
      // document.body.style.background = 'linear-gradient(45deg,  #42a5f5 0%,#478ed1 50%,#0d47a1 100%)';
    }

    // Not transitioning back

    // else if (alarm.currentTime == 0) {
    //   test.style.background = "none";
    // }

    // display it
    displayTimeLeft(secondsLeft);
  }, 1000);
}

// *WIP* Still need a way to transition back to normal background gradient

function audioEnd() {
  document.body.style.background = 'linear-gradient(45deg,  #42a5f5 0%,#478ed1 50%,#0d47a1 100%)';
  timerDisplay.textContent = '';
  endTime.textContent = '';
  displayContainer.style.display = 'none';
  clock.style.display = 'block';

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
  displayContainer.style.display = 'block'; // Brings the element back into the layout when alarm is running
  endTime.textContent = `Be Back At ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
  // Smoothes out the timer fade in and reworks the spacing when the timer starts
  clock.style.display = 'none';
  timerDisplay.style.margin = '50px';
}


buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const mins = this.minutes.value;
  clock.style.display = 'none';
  timerDisplay.style.margin = '50px';
  console.log('Custom Interval: ' + mins + ' minutes');
  timer(mins * 60);
  this.reset();
});

// *WIP* Still need to bring clock element back into DOM when timer hits 0 and alarm stops playing

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
    // *WIP* needs to be refactored.  

    // clock.textContent = "";
    // clock.style.display = 'none';
    // timerDisplay.style.margin = '0';
  }
  else {
    clock.textContent = `${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    clock.style.display = 'block';
  }
}

displayClock();


function todaysDate() {
  let bacon = new Date();
  let date = bacon.getDate();
  let day = bacon.getDay() + 1;
  let suffix = 'th';
  
  if (date == '1' || date == '21' || date == '31') suffix = 'st';
  else if (date == '2' || date == '22') suffix = 'nd';
  else if (date == '3' || date == '23') suffix = 'rd';
  else suffix = 'th';

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

  console.log('Today is ' + day + ' ' + month + ' ' + date + suffix);
  dateSelector.textContent = day + ' ' + month + ' ' + date + suffix;
}

todaysDate();


// Location *WIP* Still need to make fallback work for denied location

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else {
    console.log("Geolocation is not supported by this browser");
  }
}


function showPosition(position) {
  console.log("Latitude: " + position.coords.latitude);
  userLat = position.coords.latitude;
  console.log("Longitude: " + position.coords.longitude);
  userLong = position.coords.longitude;
  weatherCenter(userLat, userLong);
}

getLocation();


// Weather Stuff

function readJSON(file) {
  const request = new XMLHttpRequest();
  request.open('GET', file, false); // Needs to be set to true to avoid XML error, but breaks app when true. userLat & userLong are undefined at function runtime
  request.send(null);
  if (request.status == 200)
    return request.responseText;
};

// Seattle JSON https://api.openweathermap.org/data/2.5/forecast?id=5809844&APPID=4ed5e89afca7527f724a4768d95de224&units=imperial

function weatherCenter(userLat, userLong) {
  weather = JSON.parse(readJSON('https://api.openweathermap.org/data/2.5/forecast?lat=' + userLat + '&lon=' + userLong + '&APPID=4ed5e89afca7527f724a4768d95de224&units=imperial'));
  googleAPI = JSON.parse(readJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + userLat + ',' + userLong + '&key=AIzaSyAaArZPBLx2r7cdmxvRMzcr_I0MuXA7uxA'));
  today = Math.round(weather.list[0].main.temp);
  let city = weather.city.name;
  let desc = weather.list[0].weather[0].main;
  let weatherCode = weather.list[0].weather[0].id;
  let icon = 'wi-owm-' + weatherCode;
  state = googleAPI.results[0].address_components[4].short_name;
  console.log('State: ' + state);

  // Displays error message if no weather info is found

  // *WIP* setTimout is broken. Long and Lat are undefined when rerun

  if (weatherCode) { 
    iconSelector.classList.add(icon);
    weatherSelector.textContent = today + '°' + unitsSymbol;
    citySelector.textContent = city + ', ' + state;
  } else { 
    weatherSelector.textContent = 'No Weather Info Available';
  }
  console.log('Current Weather in ' + city + ' is ' + today + ' °' + unitsSymbol + ' and ' + desc + 'ing');
  setTimeout(weatherCenter, 60000);
};

function unitsChange() {
  if (unitsSymbol == 'F') {
    const todayInC = Math.round((today - 32) * .5556);
    unitsSymbol = 'C';
    weatherSelector.textContent = todayInC + '°' + unitsSymbol;
    console.log('Converted temperature to Celcius');
  }
  else {
    unitsSymbol = 'F';
    weatherSelector.textContent = today + '°' + unitsSymbol;
    console.log('Converted temperature to Fahrenheit');
  }
}


iconSelector.addEventListener('click', function() {
    unitsChange();
});
