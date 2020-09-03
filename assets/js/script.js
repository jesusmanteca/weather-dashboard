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

        spanUVContainerEl.innerHTML = "UV: " + response.value


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
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
          console.log(response)




          for (let i = 0; i < response.list.length; i += 8) {

            var temperatureForecast = response.list[i].main.temp
            var dayOfTheWeek = moment(response.list[i].dt_txt).format('dddd')
            var humidity = response.list[i].main.humidity
            var emoji 
            
              console.log(`Day of the week: ${dayOfTheWeek}`)
              console.log("Humidity:", humidity)
              console.log(`Temperature: ${temperatureForecast} degrees`)


            //   this will give me the day
              var dayDisplay = [i]/8 + 1
              console.log(dayDisplay)

              // create anchor to append for every day of the week
              var forecastDivEl = document.createElement("a");

              

              
              // add id and class
              forecastDivEl.setAttribute("id", "hour" + [i]);
              forecastDivEl.setAttribute("style", "padding: 15px");

              // append the humidity, dayTempEl, emojiEl into the forecastDivEl

              //add the  information inside the anchor
              forecastDivEl.innerHTML = temperatureForecast

             //append child to parent
              divForecastContainer.appendChild(forecastDivEl);

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
        console.log("Current Weather:", response.main.temp);
        console.log("Current Weather:", response);

        spanContainer.innerHTML = '';
        responseContainerEl.innerHTML = '';

        spanContainerEl.innerHTML = response.name
        responseContainerEl.innerHTML = response.main.temp;
  
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
  
  