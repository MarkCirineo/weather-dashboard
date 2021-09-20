var cityInput = $("input");
var searchBtn = $("button");
var pastSearches = $(".past-searches");

searchBtn.on("click", saveInput);
cityInput.on("keydown", saveInputOnEnter);

function saveInput() {
    localStorage.setItem(cityInput.val().toUpperCase(), cityInput.val())
        makeButtons();
        cityInput.val("") 
}

function saveInputOnEnter(e) {
    var key = e.key;
    if (key === "Enter") {
        localStorage.setItem(cityInput.val().toUpperCase(), cityInput.val())
        makeButtons();
        cityInput.val("")
    }
}

var pastCity;

function makeButtons() {
    if (pastSearches.children().text().includes(cityInput.val())) { 
        return;
    }
    pastCity = $("<button>")
    pastCity.text(cityInput.val());
    pastCity.attr("id", cityInput.val().toLowerCase())
    pastCity.attr("class", "btn btn-secondary")
    pastSearches.append(pastCity);
    var cityButton = $(pastCity)
    cityButton.on("click", getWeatherFromButton)
}

var data;
var APIKey = "82bef0fd1f19abbff878e3a5939a1627"

function getWeatherFromButton() {
    var city = pastCity.attr("id");
    
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

function displayWeather(data, city) {
    var cityArr = city.split(" ");
    for (let i = 0; i < cityArr.length; i++) {
        cityArr[i] = cityArr[i].charAt(0).toUpperCase() + cityArr[i].substr(1);
    }
    city = cityArr.join(" ")
    displayCityName.text(city)
    //TODO: display temp, wind speed, humidity, and uv index
}