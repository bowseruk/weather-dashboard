const APIKEY = 'fd90c2e0e60b3f4e9689e93a70e6e95d';

fetch('https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json')
    .then((response) => response.json())
    .then((json) => console.log(json));

let geourl = (cityName, stateCode, countryCode, limit, apiKey) => `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}${`,${stateCode}`}${`,${countryCode}`}&limit=${limit}&appid=${apiKey}`
let weatherURL = (lat, lon, apiKey) => `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

function init() {
    renderForecast()

}

function renderForecast() {
    // Empty current contents
    $('#today').empty()
    $('#forecast').empty()

    // Make the today box
    $('#today').append($('<div>').append($('<h2>').text('Placeholder')).append($('<p>').text('Temp:')).append($('<p>').text('Wind:')).append($('<p>').text('Humidity:')))
    // Forecast
    for (let i = 0; i < 5; i++) {
        $('#forecast').append($('<div>').append($('<h2>').text('Placeholder')).append($('<p>').text('Temp:')).append($('<p>').text('Wind:')).append($('<p>').text('Humidity:')))
    }
}

$('#search-button').on('click', (event) => {
    event.preventDefault()
    console.log(geourl('Gainsborough', '','GB', 5, APIKEY))
    console.log(weatherURL("53.3968736","-0.7739577",APIKEY));
})

init()

