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
    // console.log(cityInput);
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
                console.log(JSON.parse(localStorage.getItem("cityHistory")));
                console.log(JSON.parse(localStorage.getItem("cityHistory"))[city.toLowerCase()]);
                setHeader(JSON.parse(localStorage.getItem("cityHistory"))[city.toLowerCase()]);
                for (var i = 0; i < 5; i++) {
                    setBody(JSON.parse(localStorage.getItem("cityHistory"))[city.toLowerCase()], i);
                }
            }
        });
}

function getWeather(lat, lon, city) {
    var weatherURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
    fetch(weatherURL)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            cityHistory[city.toLowerCase()] = data;
            console.log(cityHistory);
            saveToStorage();
            document.getElementsByTagName('h1')[0].textContent = city + '(date) ' + getEmoji();
            setHeader(data);

            if (data.current.uvi > 10) {
                $('#uvi').addClass('bg-danger text-light');
            } else if (data.current.uvi > 5) {
                $('#uvi').addClass('bg-warning text-light');
            } else {
                $('#uvi').addClass('bg-success text-light');
            }

            for (var i = 0; i < 5; i++) {
                document.getElementsByTagName('h5')[i].textContent = '(date)';
                setBody(data, i);
            }
        })
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

function setHeader(data) {
    console.log('---');
    console.log(data.current.weather[0].icon);
    // document.querySelector('#emoji').setAttribute('src', getEmoji(data.current.weather[0].icon));
    var iconURL = 'http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png';
    console.log('<img src=http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png>');
    console.log('<img src=\'http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png\'>');
    document.getElementsByClassName('emoji')[0].setAttribute('src', getEmoji(data.current.weather[0].icon));
    document.querySelector('#temp').textContent = convToF(data.current.temp);
    document.querySelector('#wind').textContent = data.current.wind_speed;
    document.querySelector('#humidity').textContent = data.current.humidity;
    document.querySelector('#uvi').textContent = data.current.uvi;
}

function setBody(data, i) {
    document.getElementsByClassName('emoji')[i+1].setAttribute('src', getEmoji(data.daily[i].weather[0].icon));
    document.getElementsByClassName('temp')[i+1].textContent = convToF(data.daily[i].temp.day);
    document.getElementsByClassName('wind')[i+1].textContent = data.daily[i].wind_speed;
    document.getElementsByClassName('humidity')[i+1].textContent = data.daily[i].humidity;
}

function saveToStorage(city) {
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
}
function getEmoji(iconText) {
    var emojiString = 'http://openweathermap.org/img/wn/' + iconText + '@2x.png';
    var iconImg = document.createElement('img');
    iconImg.setAttribute('src', emojiString);
    return emojiString;
}

submitBtnEl.addEventListener("click", handleSubmit);
historyDivElement.addEventListener("click", handleHistory);