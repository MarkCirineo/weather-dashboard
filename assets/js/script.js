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

// //! API KEY: 82bef0fd1f19abbff878e3a5939a1627
function getWeatherFromButton() {
    var city = pastCity.attr("id");
    console.log(city);
    
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=imperial&appid=82bef0fd1f19abbff878e3a5939a1627"
    fetch(url)
        .then(function (response) {
            console.log(response)
            return response.json();
        })
            .then(function (data) {
                console.log(data);
            })
} 

