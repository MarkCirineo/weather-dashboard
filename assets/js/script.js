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

function makeButtons() {
    if (pastSearches.children().text().includes(cityInput.val())) { 
        return;
    }
    var pastCity = $("<button>")
    pastCity.text(cityInput.val());
    pastCity.attr("id", cityInput.val().toLowerCase())
    pastCity.attr("class", "btn btn-secondary")
    pastSearches.append(pastCity);
}

