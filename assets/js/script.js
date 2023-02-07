// This is the api key for the script
const APIKEY = 'fd90c2e0e60b3f4e9689e93a70e6e95d';

fetch('https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json')
    .then((response) => response.json())
    .then((json) => console.log(json));
// These functions make the url for api calls
let geourl = (cityName, limit, apiKey) => `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`

// This function sets up the page
function init() {
    // Check if the history has been created. If not default to london.
    if (localStorage.getItem("cityHistory") === null) {
        localStorage.setItem("cityHistory", JSON.stringify([{"name": "London", "query": "London, GB", "lat": 51.5073219, "lon": -0.1276474}]));
    }
    renderButtons()
    renderForecast()
}

function getForecast(lat, lon) {
    let weatherURL = (lat, lon, apiKey) => `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    $.ajax({
        url: weatherURL(lat,lon, APIKEY),
        method: "GET"
    }).then((response) => {
        console.log(response);
        return response;
    });
}

function renderForecast() {
    // Empty current contents
    $('#today').empty()
    $('#forecast').empty()
    // Get city object of object most recent search
    let currentCity = JSON.parse(localStorage.getItem("cityHistory"))[0];
    let weatherData = getForecast(currentCity.lat, currentCity.lon);
    console.log(weatherData);
    // Make the today box
    $('#today').append($('<div>').addClass("card").append($('<h3>').text(`${currentCity.name}`)).append($('<p>').text('Temp:')).append($('<p>').text('Wind:')).append($('<p>').text('Humidity:')))
    // Forecast
    for (let i = 0; i < 5; i++) {
        $('#forecast').append($('<div>').addClass("card forecast-card col-lg-2 me-auto").append($('<h3>').text('Placeholder')).append($('<p>').text('Temp:')).append($('<p>').text('Wind:')).append($('<p>').text('Humidity:')))
    }
}
// This renders the buttons based on the history of searches.
function renderButtons() {
    // Look in the history and make a button for previous searches
    JSON.parse(localStorage.getItem("cityHistory")).forEach( element => {
        $('.input-group-append').append($('<button>').text(`${element.name}`).attr(`data-query`, `${element.query}`).attr(`data-lat`, `${element.lat}`).attr(`data-lon`, `${element.lon}`))
    })
}

$('#search-button').on('click', (event) => {
    event.preventDefault()
    console.log(geourl('London, GB', 5, APIKEY))
    console.log(weatherURL("53.3968736","-0.7739577",APIKEY));
})

init()

