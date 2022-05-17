var submitCityEl = document.querySelector('#city-input');
var submitBtnEl = document.querySelector('#submit');
var historyDivElement = document.querySelector('#history');
var apiKey = '4a2fb25bb7a6dbb5c6ef6fca5eb312bc';
var limit = 5;
var cityHistory = {};
var cityHistoryList = [];
var cityHistoryDataList = [];

function handleSubmit(event) {
    event.preventDefault();
    var cityInput = submitCityEl.value;
    // get geo location, then weather
    getGeoLocation(cityInput);
}

function handleHistory(event) {
    event.preventDefault();
    var element = event.target;
    if (element.getAttribute('class') == 'btn btn-block bg-secondary') {
        var city = element.textContent;
        getGeoLocation(city);
    }
}

function getGeoLocation(city) {
    var geoURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=' + limit + '&appid=' + apiKey;
    fetch(geoURL)
        .then(response => response.json())
        .then(data => {
            // get weather using geo location
            if (!Object.keys(cityHistory).includes(city.toLowerCase())) {
                addHistory(city);
                const lat = data[0].lat;
                const lon = data[0].lon;
                getWeather(lat, lon, city);
            } else {
                setHeader(JSON.parse(localStorage.getItem("cityHistory"))[city.toLowerCase()], city);
                for (var i = 0; i < 5; i++) {
                    setBody(JSON.parse(localStorage.getItem("cityHistory"))[city.toLowerCase()], i);
                }
                setUVColor(JSON.parse(localStorage.getItem("cityHistory"))[city.toLowerCase()].current.uvi);
            }
        });
}

function getWeather(lat, lon, city) {
    var weatherURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
    fetch(weatherURL)
        .then(response => response.json())
        .then(data => {
            cityHistory[city.toLowerCase()] = data;
            saveToStorage();
            setHeader(data, city);
            setUVColor(data.current.uvi);
            for (var i = 0; i < 5; i++) {
                document.getElementsByTagName('h5')[i].textContent = '(date)';
                setBody(data, i);
            }
        })
}

function setUVColor(UVI) {
    if (UVI > 10) {
        $('#uvi').removeClass().addClass('rounded px-2 bg-danger text-light');
    } else if (UVI > 5) {
        $('#uvi').removeClass().addClass('rounded px-2 bg-warning text-light');
    } else {
        $('#uvi').removeClass().addClass('rounded px-2 bg-success text-light');
    }
}

function convToF(tempK) {
    return Math.round(((tempK - 273.15) * (9/5) + 32) * 100) / 100;
}

function addHistory(city) {
    var historyButton = document.createElement('button');
    historyButton.setAttribute('type', 'button');
    historyButton.setAttribute('class', 'btn btn-block bg-secondary');
    historyButton.textContent = city;
    historyDivElement.appendChild(historyButton);
}

function setHeader(data, city) {
    document.getElementById('city-header').textContent = city;
    document.getElementById('date-header').textContent = '(' + getDate(0) + ')';
    document.getElementsByClassName('emoji')[0].setAttribute('src', getEmoji(data.current.weather[0].icon));
    document.querySelector('#temp').textContent = convToF(data.current.temp);
    document.querySelector('#wind').textContent = data.current.wind_speed;
    document.querySelector('#humidity').textContent = data.current.humidity;
    document.querySelector('#uvi').textContent = data.current.uvi;
}

function setBody(data, i) {
    document.getElementsByClassName('date')[i].textContent = getDate(i);
    document.getElementsByClassName('emoji')[i+1].setAttribute('src', getEmoji(data.daily[i].weather[0].icon));
    document.getElementsByClassName('temp')[i].textContent = convToF(data.daily[i].temp.day);
    document.getElementsByClassName('wind')[i].textContent = data.daily[i].wind_speed;
    document.getElementsByClassName('humidity')[i].textContent = data.daily[i].humidity;
}

function saveToStorage(city) {
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
}
function getEmoji(iconText) {
    var emojiString = 'http://openweathermap.org/img/wn/' + iconText + '@2x.png';
    return emojiString;
}

function getDate(offset) {
    var date = moment().add(offset, 'd').format('MM/DD/YYYY');
    return date;
}

submitBtnEl.addEventListener("click", handleSubmit);
historyDivElement.addEventListener("click", handleHistory);