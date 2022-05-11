var submitCityEl = document.querySelector('#city-input');
var submitBtnEl = document.querySelector('#submit');
var apiKey = '4a2fb25bb7a6dbb5c6ef6fca5eb312bc';
var limit = 5;

function handleSubmit(event) {
    event.preventDefault();
    var cityInput = submitCityEl.value;
    // console.log(cityInput);
    // get geo location, then weather
    getGeoLocation(cityInput)
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
        })
}

submitBtnEl.addEventListener("click", handleSubmit);
