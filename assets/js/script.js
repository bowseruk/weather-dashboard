const APIKEY = 'fd90c2e0e60b3f4e9689e93a70e6e95d';

fetch('https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json')
    .then((response) => response.json())
    .then((json) => console.log(json));

let geourl = (cityName, stateCode, countryCode, limit, apiKey) => `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}${`,${stateCode}`}${`,${countryCode}`}&limit=${limit}&appid=${apiKey}`

$('#search-button').on('click', (event) => {
    event.preventDefault()
    console.log(geourl('gaza', '','PS', 5, APIKEY))
})
