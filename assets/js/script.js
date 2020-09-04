var APIKey = "a9c57e39deffb9e105b27ed8d1437b94"
var responseContainerEl = document.querySelector('#response-container');
var spanContainerEl = document.querySelector('#spanContainer');
var spanUVContainerEl = document.querySelector('#spanUVContainer');
var divForecastContainerEl = document.querySelector('#divForecastContainer');




function renderedCities() {

    var citiesResearched = JSON.parse(localStorage.getItem('historyOfCitiesResearched')) || [];
    // Empties out the html
    $('#renderCities').empty();

    // Iterates over the 'list'
    for (var i = 0; i < citiesResearched.length; i++) {
        
      var toDoItem = $('<h3>');
      toDoItem.text(citiesResearched[i]);
      toDoItem.addClass('citiesResearched');

      // Adds 'h3' to the renderedCities div
      $('#renderedCities').append(toDoItem);
    }
  }


function getUV(latitude, longitude){
    fetch
    (
      'http://api.openweathermap.org/data/2.5/uvi?appid='
      + APIKey
      + '&lat='
      + latitude
      + '&lon='
      + longitude
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        console.log("UV:", response.value);

        spanUVContainer.innerHTML = '';

        spanUVContainerEl.innerHTML = "UV Index: " + response.value


      });
}
function getForecast(searchTerm){
    fetch
    (
      'http://api.openweathermap.org/data/2.5/forecast?q='
      + searchTerm 
      + '&appid='
      + APIKey
      + '&units=imperial'
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response)

            divForecastContainer.innerHTML = '<br> <h3> 5-Day Forecast </h3>';



            for (let i = 0; i < response.list.length; i += 8) {

                var temperatureForecast = response.list[i].main.temp
                var dateYYYYMMDDHHMMSS = response.list[i].dt_txt
                var dayOfTheWeek = moment(dateYYYYMMDDHHMMSS).format('dddd')
                var calendarDay = moment(dateYYYYMMDDHHMMSS).format('LL')
                var humidity = response.list[i].main.humidity
                var emoji
                var weatherDescription = response.list[i].weather[0].description
                var weatherEmoji = response.list[i].weather[0].main


                if (weatherEmoji == "Clouds"){
                    weatherEmoji = "☁️"
                } else if (weatherEmoji == "Thunderstorm") {
                    weatherEmoji = "⛈"
                } else if (weatherEmoji == "Drizzle") {
                    weatherEmoji = "🌧"
                } else if (weatherEmoji == "Rain") {
                    weatherEmoji = "🌧"
                } else if (weatherEmoji == "Snow") {
                    weatherEmoji = "❄️"
                } else if (weatherEmoji == "Clear") {
                    weatherEmoji = "☀️"
                } 
        

                console.log(`Day of the week: ${dayOfTheWeek}`)
                console.log("Humidity:", humidity)
                console.log("Temperature:", temperatureForecast, "degrees")

                //   this will give me the day
                var dayDisplay = [i] / 8 + 1
                console.log(dayDisplay)

                // create anchor to append for every day of the week
                var forecastDivEl = document.createElement("a");

                // add id and class
                forecastDivEl.setAttribute("id", "hour" + [i]);
                forecastDivEl.setAttribute("style", "padding: 15px");

                // append the humidity, dayTempEl, emojiEl into the forecastDivEl - and add an if/else statememt


                //add the  information inside the anchor
                forecastDivEl.innerHTML = "<br>Temperature for " + dayOfTheWeek + ", " + calendarDay + "<br>" + Math.floor(temperatureForecast) + "&#176 and a " + weatherDescription + " " + weatherEmoji + "<br>"
                    + "Humidity: " + humidity + "%"
                    + "<br><br>"

                //append child to parent
                divForecastContainerEl.appendChild(forecastDivEl);

            }
            var latitude = response.city.coord.lat;
            console.log("Latitude: ", latitude)
            var longitude = response.city.coord.lon;;
            console.log("Longitude: ", longitude);
            getUV(latitude, longitude)

        });

}
function getCurrentWeather(searchTerm){

    fetch
    (
      'http://api.openweathermap.org/data/2.5/weather?q='
      + searchTerm 
      + '&appid='
      + APIKey
      + '&units=imperial'
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(response) { 
          
        
        console.log("Current Weather API:", response);
        
        var selectedCity = response.name
        var currentWeather = response.main.temp
        var windSpeed = response.wind.speed
        var weatherEmoji = response.weather[0].main
        var currentDay = moment().format('LL')
        
        spanContainerEl.innerHTML = '';
        responseContainerEl.innerHTML = '';

        //weather emoji logic
    
        if (weatherEmoji == "Clouds"){
            weatherEmoji = "☁️"
        } else if (weatherEmoji == "Thunderstorm") {
            weatherEmoji = "⛈"
        } else if (weatherEmoji == "Drizzle") {
            weatherEmoji = "🌧"
        } else if (weatherEmoji == "Rain") {
            weatherEmoji = "🌧"
        } else if (weatherEmoji == "Snow") {
            weatherEmoji = "❄️"
        } else if (weatherEmoji == "Clear") {
            weatherEmoji = "☀️"
        } 


        spanContainerEl.innerHTML = selectedCity + " - " + currentDay + " " + weatherEmoji
        responseContainerEl.innerHTML = "The current weather is " +  Math.floor(currentWeather) + "&#176 <br>" + "Wind speeds at: " + windSpeed + " mph"
  
      });
}
function searchHandler(event) {
    event.preventDefault()
    var searchTerm = document.querySelector('#searchTerm').value.trim();
    
    if (searchTerm) {
        getCurrentWeather(searchTerm);
        getForecast(searchTerm);
        
        document.querySelector('#searchTerm').value = ""
    } else {
        alert("Please enter a city");
    }

      
  }

renderedCities();
$("#searchBtn").click(searchHandler)
  
  