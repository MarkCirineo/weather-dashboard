var cityInput = $("input");
var searchBtn = $(".search-button");
var pastSearches = $(".past-searches");

searchBtn.on("click", saveInput);
cityInput.on("keydown", saveInputOnEnter);

// loads past searches from local storage and adds them to the array used in saveInput() and saveInputOnEnter()
var savedCities = [getPastSearches()];

function saveInput() {
    savedCities.push(cityInput.val().toLowerCase().trim());
    localStorage.setItem("cities", savedCities)
    getWeatherFromSearch(cityInput.val().toLowerCase().trim());
    makeButtons();
    cityInput.val("") 
}

function saveInputOnEnter(e) {
    var key = e.key;
    if (key === "Enter") {
        savedCities.push(cityInput.val().toLowerCase().trim());
        localStorage.setItem("cities", savedCities)
        getWeatherFromSearch(cityInput.val().toLowerCase().trim());
        makeButtons();
        cityInput.val("")
    }
}

var pastCity;
//creates buttons showing previous searches
function makeButtons() {
    if (pastSearches.children().text().toLowerCase().includes(cityInput.val().toLowerCase())) { 
        return;
    } else if (pastSearches.children().length > 13) {
        pastSearches.children().last().remove();
    }
    pastCity = $("<button>")
    var cityName = cityInput.val().toLowerCase();
    var cityNameArr = cityName.split(" ");
    for (let i = 0; i < cityNameArr.length; i++) {
        cityNameArr[i] = cityNameArr[i].charAt(0).toUpperCase() + cityNameArr[i].substr(1);
    }
    cityName = cityNameArr.join(" ");
    pastCity.text(cityName);
    pastCity.attr("id", cityInput.val().toLowerCase())
    pastCity.attr("class", "btn btn-secondary")
    pastSearches.prepend(pastCity);
    var cityButton = $(pastCity)
    cityButton.on("click", getWeatherFromButton)
}

// var data;
var APIKey = "82bef0fd1f19abbff878e3a5939a1627"

//function run when using past search buttons
function getWeatherFromButton() {
    var city = $(this).attr("id");

    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=imperial&appid=" + APIKey
    fetch(url)
        .then(function (response) {
            return response.json();
        })
            .then(function (data) {
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                var newUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey
                fetch(newUrl)
                    .then(function (newResponse) {
                        return newResponse.json();
                    })
                        .then(function(newData) {
                            displayWeather(newData, city);
                        })
            })
} 

// function run on initial input
function getWeatherFromSearch(city) {
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=imperial&appid=" + APIKey
    fetch(url)
        .then(function (response) {
            return response.json();
        })
            .then(function (data) {
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                var newUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey
                fetch(newUrl)
                    .then(function (newResponse) {
                        return newResponse.json();
                    })
                        .then(function(newData) {
                            displayWeather(newData, city);
                        })
            })
}

var displayCityName = $(".city-name");
var displayCityInfo = $(".city-info-list");
var displayCurrentTemp = $("#current-temp");
var displayCurrentWind = $("#current-wind");
var displayCurrentHumidity = $("#current-humidity");
var displayCurrentUVI = $("#current-uvi");


function displayWeather(data, city) {
    var cityArr = city.split(" ");
    for (let i = 0; i < cityArr.length; i++) {
        cityArr[i] = cityArr[i].charAt(0).toUpperCase() + cityArr[i].substr(1);
    }
    var currentTimeUnix = data.current.dt + data.timezone_offset;
    var currentDate = new Date(currentTimeUnix*1000)
    currentDate = currentDate.toLocaleDateString("en-US");
    city = cityArr.join(" ")
    displayCityName.text(city + " " + currentDate)
    //* displays current weather
    var currentTemp = data.current.temp;
    var currentWindSpeed = data.current.wind_speed;
    var currentHumidity = data.current.humidity;
    var currentUVI = data.current.uvi;
    displayCurrentTemp.text("Temp: " + currentTemp + "°F");
    displayCurrentWind.text("Wind: " + currentWindSpeed + " MPH");
    displayCurrentHumidity.text("Humidity: " + currentHumidity);
    displayCurrentUVI.text("UV Index: " + currentUVI + " %")

    //*displays 5 day forecast
    var dailyDataArr = data.daily;

    for (let i = 1; i < 6; i++) {
        var forecastTimeUnix = dailyDataArr[i].dt + data.timezone_offset;
        var forecastDate = new Date(forecastTimeUnix*1000);
        forecastDate = forecastDate.toLocaleDateString("en-US");
        var displayForecast = $("#"+i);
        displayForecast.siblings().text(forecastDate);
        displayForecast.children().eq(0).text("Temp: " + dailyDataArr[i].temp.day + "°F");
        displayForecast.children().eq(1).text("Wind: " + dailyDataArr[i].wind_speed + " MPH");
        displayForecast.children().eq(2).text("Humidity: " + dailyDataArr[i].humidity + " %");
    }
}

// function to load past searches from local storage and display them
function getPastSearches() {
    var getCities = localStorage.getItem("cities")
    if (getCities === null) {
        return;
    }
    var citiesArr = getCities.split(",")
    for (let i = 0; i < citiesArr.length; i++) {
        citiesArr[i] = citiesArr[i].charAt(0).toUpperCase() + citiesArr[i].substr(1);
        cityName = citiesArr.join(" ");
        pastCity = $("<button>")
        pastCity.text(citiesArr[i]);
        pastCity.attr("id", citiesArr[i])
        pastCity.attr("class", "btn btn-secondary")
        pastSearches.prepend(pastCity);
        var cityButton = $(pastCity)
        cityButton.on("click", getWeatherFromButton)
        if (citiesArr[i] === "") {
            pastCity.remove();
        }
        var savedCities = [];
        savedCities = localStorage.getItem("cities")
    }
    return savedCities;
}

$(".clear-button").on("click", clearHistory)

function clearHistory() {
    localStorage.setItem("cities", "")
    pastSearches.children().remove();
}