var submitCityEl = document.querySelector('#city-input');
var submitBtnEl = document.querySelector('#submit');
var historyDivElement = document.querySelector('#history');
var apiKey = '4a2fb25bb7a6dbb5c6ef6fca5eb312bc';
var limit = 5;
var cityHistory = [];

function handleSubmit(event) {
    event.preventDefault();
    var cityInput = submitCityEl.value;
    // console.log(cityInput);
    // get geo location, then weather
    // getGeoLocation(cityInput) 
    addHistory(cityInput);
}

function handleHistory(event) {
    event.preventDefault();
    var element = event.target;
    if (element.getAttribute('class') == 'btn btn-block bg-secondary') {
        var city = element.textContent;
        // getGeoLocation(city);
    }
}

function getGeoLocation(city) {
    var geoURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=' + limit + '&appid=' + apiKey;
    fetch(geoURL)
        .then(response => response.json())
        .then(data => {
            // get weather using geo location
            const lat = data[0].lat;
            const lon = data[0].lon;
            getWeather(lat, lon);
        });
}

function getWeather(lat, lon) {
    var weatherURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
    fetch(weatherURL)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementsByTagName('h1')[0].textContent = city + '(date)' + ' (emoji)';
            document.querySelector('#temp').textContent = convToF(data.current.temp);
            document.querySelector('#wind').textContent = data.current.wind_speed;
            document.querySelector('#humidity').textContent = data.current.humidity;
            document.querySelector('#uvi').textContent = data.current.uvi;

            for (var i = 0; i < 5; i++) {
                document.getElementsByTagName('h5')[i].textContent = '(date)';
                document.getElementsByClassName('emoji')[i].textContent = data.daily[i].weather[0].icon;
                document.getElementsByClassName('temp')[i].textContent = convToF(data.daily[i].temp.day);
                document.getElementsByClassName('wind')[i].textContent = data.daily[i].wind_speed;
                document.getElementsByClassName('humidity')[i].textContent = data.daily[i].humidity;
            }
        })
}

function convToF(tempK) {
    return Math.round(((tempK - 273.15) * (9/5) + 32) * 100) / 100;
}

function addHistory(city) {
    if (!cityHistory.includes(city)) {
        var historyButton = document.createElement('button');
        historyButton.setAttribute('type', 'button');
        historyButton.setAttribute('class', 'btn btn-block bg-secondary');
        historyButton.textContent = city;
        historyDivElement.appendChild(historyButton);
        cityHistory.push(city);
    }
}

submitBtnEl.addEventListener("click", handleSubmit);
historyDivElement.addEventListener("click", handleHistory);