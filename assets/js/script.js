var cityInput = $("input");
var searchBtn = $("button");

searchBtn.on("click", saveInput);
cityInput.on("keydown", saveInputOnEnter);

function saveInput() {
    localStorage.setItem(cityInput.val().toUpperCase(), cityInput.val())
        cityInput.val("") 
}

function saveInputOnEnter(e) {
    var key = e.key;
    console.log(key)
    if (key === "Enter") {
        localStorage.setItem(cityInput.val().toUpperCase(), cityInput.val())
        cityInput.val("") 
    }
}