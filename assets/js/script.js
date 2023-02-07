// This is the api key for the script
const APIKEY = 'fd90c2e0e60b3f4e9689e93a70e6e95d';

fetch('https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json')
    .then((response) => response.json())
    .then((json) => console.log(json));
// These functions make the url for api calls
let geourl = (cityName, limit, apiKey) => `http://api.openweathermap.org/geo/1.0/direct?q=${cityName.replaceAll(" ", "")}&limit=${limit}&appid=${apiKey}`

// This class represents a city
class City {
    constructor(name, state, country, lat, lon) {
        this.name = name;
        this.state = state;
        this.country = country;
        this.lat = parseFloat(lat);
        this.lon = parseFloat(lon);
        this.query = `${name}, ${state}, ${country}`;
    };
    isEqual(city) {
        if ((city.name === this.name) && (city.state === this.state) && (city.country === this.country)) {
            return true;
        }
        return false;
    };
}

// This function sets up the page
function init() {
    // Check if the history has been created. If not default to london.
    if (localStorage.getItem("cityHistory") === null) {
        localStorage.setItem("cityHistory", JSON.stringify([new City("London", "England", "GB", 51.5073219, -0.1276474)]));
    }
    renderButtons()
    renderForecast()
}

function getForecast(lat, lon) {
    let weatherURL = (lat, lon, apiKey) => `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    $.ajax({
        url: weatherURL(lat, lon, APIKEY),
        method: "GET"
    }).then((response) => {
        console.log(response.list);
        response.list.forEach(element => {
            console.log(dayjs(element.dt * 1000).format('DD/MM/YY'), element.dt_txt, element.weather[0].icon, element.main.temp, element.wind.speed, element.main.humidity)
        })
        return response;
    });
}

function renderForecast() {
    // Empty current contents
    // $('#today').empty()
    $('#forecast').empty()
    // Get city object of object most recent search
    let currentCity = JSON.parse(localStorage.getItem("cityHistory"))[0];
    let weatherData = getForecast(currentCity.lat, currentCity.lon);
    console.log(weatherData);
    // Make the today box
    // $('#today').append($('<div>').addClass("card").append($('<h3>').text(`${currentCity.name} (${dayjs().format('DD/MM/YY')})`)).append($('<p>').text('Temp:')).append($('<p>').text('Wind:')).append($('<p>').text('Humidity:')))
    // Forecast
    for (let i = 0; i < 5; i++) {
        $('#forecast').append($('<div>').addClass("card forecast-card col-lg-2").append($('<h3>').text(`${dayjs().add(i + 1, 'day').format('ddd DD/MM/YY')}`)).append($('<p>').text('Temp:')).append($('<p>').text('Wind:')).append($('<p>').text('Humidity:')))
    }
}
// This renders the buttons based on the history of searches.
function renderButtons() {
    // Clear previous buttons
    $('#city-btn-group').empty()
    // Look in the history and make a button for previous searches
    JSON.parse(localStorage.getItem("cityHistory")).forEach(element => {
        $('#city-btn-group').append($('<button>').addClass("btn city-btn").text(`${element.name}`).attr(`data-name`, `${element.name}`).attr(`data-state`, `${element.state}`).attr(`data-country`, `${element.country}`).attr(`data-lat`, `${element.lat}`).attr(`data-lon`, `${element.lon}`))
    })
}

function addCity(name, state, country, lat, lon) {
    // Create a new city item from the response
    let city = new City(name, state, country, lat, lon);
    // Get the history of item from local Storage
    let history = JSON.parse(localStorage.getItem("cityHistory"));
    // Check if it is already in the list
    for (let i = 0; i < history.length; i++) {
        // If it is remove it, so it moves to the start of the list
        if (city.isEqual(history[i])) {
            history.splice(i, 1);
        }
    }
    // Add to the start of the list
    history.unshift(city);
    // limit the history to 10 cities to stop it getting cluttered.
    if (history.length === 10) {
        history.pop();
    }
    localStorage.setItem("cityHistory", JSON.stringify(history));
}
// What to happen when you click the search button
$('#search-button').on('click', (event) => {
    // Stop submit event
    event.preventDefault()
    // Check there is input in the box
    if ($('#search-input').val() === "") {
        return false;
    }
    let input = $('#search-input').val();
    // Clear the input out after searching
    $('#search-input').val("");
    // Call the city api to get the lon and lat
    $.ajax({
        url: geourl(input, 1, APIKEY),
        method: "GET"
    }).then((response) => {
        // Check we have recieved a city
        if (response.length > 0) {
            // Add a city to local storage
            addCity(response[0].name, response[0].state, response[0].country, response[0].lat, response[0].lon)
            // rerender the buttons
            init();
        }

    })
});

$('#clear-button').on('click', (event) => {
    // Overwrite the local storage with london if the clear button is pressed
    localStorage.setItem("cityHistory", JSON.stringify([new City("London", "England", "GB", 51.5073219, -0.1276474)]));
    init();
});

$('#city-btn-group').on('click', (event) => {
    event.preventDefault();
    addCity(event.target.dataset.name,(event.target.dataset.state === 'undefined') ? undefined : event.target.dataset.state,(event.target.dataset.country === 'undefined') ? undefined : event.target.dataset.country, event.target.dataset.lat,event.target.dataset.lon);
    init();
})

init()

