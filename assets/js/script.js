var APIKey = "a9c57e39deffb9e105b27ed8d1437b94"
var responseContainerEl = document.querySelector('#response-container');
var spanContainerEl = document.querySelector('#spanContainer');
var spanUVContainerEl = document.querySelector('#spanUVContainer');
var divForecastContainerEl = document.querySelector('#divForecastContainer');
var fiveDayForecastContainerEl = document.querySelector('#fiveDayForecastContainer');
var citiesResearched = JSON.parse(localStorage.getItem('historyOfCitiesResearched')) || [];

function renderedCities() {

    // Empties out the html
    $('#renderedCities').empty();

    // Iterates over the 'list'
    for (var i = 0; i < citiesResearched.length; i++) {
        
      var toDoItem = $(`<button class =  "${citiesResearched[i]} btn btn-light"  >`);
     
      toDoItem.text(citiesResearched[i]);


      // Adds 'button' to the renderedCities div
      $('#renderedCities').append(toDoItem);

      toDoItem.click(function(){
          var textContent = this.textContent;
          getCurrentWeather(textContent);
          getForecast(textContent);
      })
    }
}
function storeCityName(searchTerm){
  

    citiesResearched.unshift(searchTerm)

    localStorage.setItem('historyOfCitiesResearched', JSON.stringify(citiesResearched));
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

        var UVIndexValue = response.value

        if (UVIndexValue >= 0 && UVIndexValue < 3) {
            spanUVContainerEl.setAttribute("class", "col-12 green");
        } else if (UVIndexValue >= 3 && UVIndexValue < 6){
            spanUVContainerEl.setAttribute("class", "col-12 yellow");
        } else if (UVIndexValue >= 6 && UVIndexValue < 8){
            spanUVContainerEl.setAttribute("class", "col-12 orange");
        } else if (UVIndexValue >= 8){
            spanUVContainerEl.setAttribute("class", "col-12 red");
        }

        spanUVContainerEl.innerHTML = '';
        spanUVContainerEl.innerHTML = "UV Index: " + UVIndexValue


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
            console.log("Forecast API:", response)

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

                // create anchor to append for every day of the week
                var forecastDivEl = document.createElement("div");

                // add id and class
                forecastDivEl.setAttribute("id", "hour" + [i]);
                forecastDivEl.setAttribute("class", "col forecastDivs");

                // append the humidity, dayTempEl, emojiEl into the forecastDivEl - and add an if/else statememt


                //add the  information inside the anchor
                forecastDivEl.innerHTML = dayOfTheWeek + "<br>" + calendarDay + "<br>" + "Temp: " + Math.floor(temperatureForecast) + "&#176" + "<br>" + weatherDescription + "<br>" + weatherEmoji + "<br>"
                    + "Humidity: " + humidity + "%"
                    + "<br>"

                

                //append child to parent
                divForecastContainerEl.appendChild(forecastDivEl);

            }
            var latitude = response.city.coord.lat;
            var longitude = response.city.coord.lon;;
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
        fiveDayForecastContainerEl.innerHTML = '';
        divForecastContainerEl.innerHTML = '';

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


        spanContainerEl.innerHTML = "<h2>" + weatherEmoji + " " + selectedCity + " - " + currentDay +  "</h2>"

        responseContainerEl.innerHTML = "The current weather is " +  "<b> " + Math.floor(currentWeather) + "&#176 </b> <br>" + "Wind speeds at: " + windSpeed + " mph" + "<br>"

        fiveDayForecastContainerEl.innerHTML = "<h3>5 Day Forecast</h3>"
  
      });
}
function searchHandler(event) {
    event.preventDefault()
    var searchTerm = document.querySelector('#searchTerm').value.trim();
    
    if (searchTerm) {
        getCurrentWeather(searchTerm);
        getForecast(searchTerm);
        storeCityName(searchTerm)
        renderedCities(); 
        document.querySelector('#searchTerm').value = ""
    } else {
        alert("Please enter a city");
    }

      
}

$("#searchBtn").click(searchHandler)
  
  