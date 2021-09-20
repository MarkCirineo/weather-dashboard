var cityInput = $("input");
var searchBtn = $("button");
var pastSearches = $(".past-searches");

searchBtn.on("click", saveInput);
cityInput.on("keydown", saveInputOnEnter);

var savedCities = [getPastSearches()];

function saveInput() {
    savedCities.push(cityInput.val().toLowerCase().trim());
    localStorage.setItem("cities", savedCities)
        makeButtons();
        cityInput.val("") 
}

function saveInputOnEnter(e) {
    var key = e.key;
    if (key === "Enter") {
        savedCities.push(cityInput.val().toLowerCase().trim());
        localStorage.setItem("cities", savedCities)
        makeButtons();
        cityInput.val("")
    }
}

var pastCity;

function makeButtons() {
    if (pastSearches.children().text().toLowerCase().includes(cityInput.val().toLowerCase())) { 
        return;
    }
    //TODO: create conditional that checks the number of children to remove the last one and the new one
    pastCity = $("<button>")
    var cityName = cityInput.val();
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

var data;
var APIKey = "82bef0fd1f19abbff878e3a5939a1627"

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
    city = cityArr.join(" ")
    displayCityName.text(city)
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
        var displayForecast = $("#"+i)
        displayForecast.children().eq(0).text("Temp: " + dailyDataArr[i].temp.day + "°F")
        displayForecast.children().eq(1).text("Wind: " + dailyDataArr[i].wind_speed + " MPH")
        displayForecast.children().eq(2).text("Humidity: " + dailyDataArr[i].humidity + " %")  
    }
}

function getPastSearches() {
    var getCities = localStorage.getItem("cities")
    if (getCities === null) {
        return;
    }
    var citiesArr = getCities.split(",")
    //todo: fix to get all words in city names capitalized (instead of just first)
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