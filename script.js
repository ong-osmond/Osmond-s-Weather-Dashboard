/*jshint esversion: 6 */

//Define global variables and default values
var key = "59e42ab69c520d95ac336e9cccb57653";
var forecastDays = 5; //configurable number of days to forecast
var searchHistory = [];
var searchHistoryLength = 5; //configurable number of search history 

//-----FUNCTIONS-----//

//Get forecast for the coming days
function getForecast(forecast) {
    $("#forecast").empty();
    var forecastHeaderRow = $("<tr>");
    $("#forecast").append(forecastHeaderRow);
    var forecastLabel = $("<th>").attr("colspan", forecastDays).text(forecastDays + "-Day Forecast");
    forecastHeaderRow.append(forecastLabel);
    var forecastRow = $("<tr>");
    $("#forecast").append(forecastRow);
    for (i = 1; i <= forecastDays; i++) {
        var day = $("<td>").text(getDate(forecast[i].dt));
        (forecastRow).append(day);
        day.attr("style", "font-weight: bold");
        var iconURL = "http://openweathermap.org/img/wn/" + forecast[i].weather[0].icon + ".png";
        var icon = $("<img src=" + iconURL + ">");
        day.append(icon);
        var tempMax = $("<p>").text("Temp (high): " + forecast[i].temp.max + "C");
        day.append(tempMax);
        var tempMin = $("<p>").text("Temp (low): " + forecast[i].temp.min + "C");
        day.append(tempMin);
        var humidity = $("<p>").text("Humidity: " + forecast[i].humidity + "%");
        day.append(humidity);
    }
}

//Get current weather of the city just searched
function getWeather(lat, lon) {
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=metric&exclude=minutely,hourly&appid=" +
        key;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        var tempInCelsius = response.current.temp;
        var temp = $("<p>").text("Temperature : " +
            tempInCelsius.toFixed(1) +
            "C");
        var iconURL = "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png";
        var icon = $("<img src=" + iconURL + ">");
        var humidity = $("<p>").text("Humidity : " + response.current.humidity + "%");
        var windSpeed = $("<p>").text("Wind Speed : " + response.current.wind_speed + " m/s");
        var uvIndex = $("<p>").text("UV Index : " + response.current.uvi);
        if (response.current.uvi <= 5) {
            uvIndex.attr("style", "background-color:yellow;"); //"moderate";
        } else if (response.current.uvi <= 7) {
            uvIndex.attr("style", "background-color:orange;"); //"high"
        } else if (response.current.uvi <= 10) {
            uvIndex.attr("style", "background-color:red;"); //"very high"
        } else {
            uvIndex.attr("style", "background-color:violet;"); //"extreme"
        }
        $("#current-weather").attr("style", "font-weight: bold");
        $("#current-weather").append(icon);
        $("#current-weather").append(temp);
        $("#current-weather").append(humidity);
        $("#current-weather").append(windSpeed);
        $("#current-weather").append(uvIndex);
        var forecast = response.daily;
        getForecast(forecast);

    });

}

//Handle dates
function getDate(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    date = new Date(1000 * date);
    return date.getDate() + "/" + months[date.getMonth()] + "/" + date.getFullYear();
}


//Openweathermap has a "onecall" endpoint that requires the city's coordinates. 
//Make an initial ajax call to retrieve the current city's coordinates.
function getCoordinates(cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=" +
        key;
    $.ajax({
        url: queryURL,
        method: "GET",
        error: function() {
            $("#current-weather").empty();
            $("#forecast").empty();
            alert("Cannot get data for the last city you entered.");
        }
    }).then(function(response) {
            var date = response.dt;
            date = getDate(date);
            var cityName = $("<h5>").text(response.name + " (" + date + ")");
            $("#current-weather").append(cityName);
            var cityLat = response.coord.lat;
            var cityLon = response.coord.lon;
            getWeather(cityLat, cityLon);
        }

    );
}

//Handle search history
function listSearchHistory() {
    $("#cities").empty();
    if (JSON.parse(localStorage.searchHistory) != null) {
        searchHistory = JSON.parse(localStorage.searchHistory);
    } //Retrieve existing searchHistory from local storage
    for (i = searchHistory.length - 1; i >= (searchHistory.length - searchHistoryLength); i--) {
        var cityName = JSON.parse(localStorage.searchHistory)[i];
        if (cityName == null) {
            return;
        } else {
            var city = $("<button>").text(cityName.toUpperCase());
            city.addClass("city-button");
            city.addClass("btn btn-primary btn-md btn-block");
            city.attr("id", "city-" + i);
            city.attr("display", "block");
            $("#cities").append(city);
            //Add event handler for selecting a city from the search history
            city.on("click", function(event) {
                event.preventDefault();
                $("#current-weather").empty();
                $("#forecast").empty();
                var cityClicked = event.target.textContent;
                getCoordinates(cityClicked);
            });
        }
    }
}

//Main function to initiate searching a city and its weather
function searchCity() {
    var cityName = $("#searchCity").val();
    if (cityName == "") {
        alert("Please enter a city.");
    } else {
        $("#current-weather").empty();
        getCoordinates(cityName);
        if (localStorage.getItem("searchHistory") == null ||
            localStorage.getItem("searchHistory") == 'undefined') {
            searchHistory.push(cityName);
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        } else {
            //Retrieve existing searchHistory from local storage
            if (JSON.parse(localStorage.searchHistory) !== null) {
                searchHistory = JSON.parse(localStorage.searchHistory);
            }
            //Update the searchHistory
            searchHistory.push(cityName);
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        }
        $("input:text").val("");
        listSearchHistory();
    }
}

//Use local storage to remember the last search city and get the current weather
function loadInitialCity() {
    if (localStorage.searchHistory == null) {
        return;
    } else {
        var searchHistoryLength = parseInt((JSON.parse(localStorage.searchHistory)).length - 1);
        var lastCityName = JSON.parse(localStorage.searchHistory)[searchHistoryLength];
        getCoordinates(lastCityName);
    }
}

//-----BUTTONS-----//

$("#search").on("click",
    searchCity
);

$("#clear-history").on("click", function(event) {
    event.preventDefault();
    localStorage.removeItem("searchHistory");
    searchHistory = [];
    $("#cities").empty();
    $("#current-weather").empty();
    $("#forecast").empty();
});

//-----Function calls on initial loading of the page-----//

if (localStorage.searchHistory != null) {
    listSearchHistory();
}

loadInitialCity();