// This is the api key for the script
const APIKEY = 'fd90c2e0e60b3f4e9689e93a70e6e95d';
// These functions make the url for api calls
let geourl = (cityName, limit, apiKey) => `https://api.openweathermap.org/geo/1.0/direct?q=${cityName.replaceAll(" ", "")}&limit=${limit}&appid=${apiKey}`

// This class represents a city
class City {
    // Creates the class when it is created
    constructor(name, state, country, lat, lon) {
        this.name = name;
        this.state = state;
        this.country = country;
        this.lat = parseFloat(lat);
        this.lon = parseFloat(lon);
        this.query = `${name}, ${state}, ${country}`;
    };
    // Test to see if two objects are equal, as equivalence operator does not function the way wanted for the project
    isEqual(city) {
        if ((city.name === this.name) && (city.state === this.state) && (city.country === this.country)) {
            return true;
        }
        return false;
    };
}

// This class represents a city
class Weather {
    // This is created when the class is made
    constructor(day) {
        this._day = day;
        this._temp = [];
        this._windSpeed = [];
        this._humidity = [];
        this._icon = []
    };
    // These functions add a reading to the array
    addIcon(icon) {
        this._icon.push(icon)
    }
    addTemp(temp) {
        this._temp.push(temp)
    }
    addWindSpeed(windSpeed) {
        this._windSpeed.push(windSpeed)
    }
    addHumidity(humidity) {
        this._humidity.push(humidity)
    }
    //  Get functions for the object
    get icon() {
        return `https://openweathermap.org/img/wn/${this._icon[Math.floor(this._icon.length/2)]}@2x.png`
    }
    get meanTemp() {
        return this._temp.reduce(function(p,c,i){return p+(c-p)/(i+1)},0)
    }
    get highTemp() {
        return Math.max(...this._temp)
    }
    get lowTemp() {
        return Math.min(...this._temp)
    }
    get meanWindSpeed() {
        return this._windSpeed.reduce(function(p,c,i){return p+(c-p)/(i+1)},0)
    }
    get meanHumidity() {
        return this._humidity.reduce(function(p,c,i){return p+(c-p)/(i+1)},0)
    }
    get day() {
        return this._day
    }
    // Categorise the weather as 0: cold, 1: mild, 2: warm, 3: hot
    get tempCategory() {
        let testTemp = this.highTemp;
        if (testTemp < 0) {
            return 0;
        } else if (testTemp >= 0 && testTemp < 15) {
            return 1;
        } else if (testTemp >= 15 && testTemp < 25 ) {
            return 2;
        } else {
            return 3;
        }
    }
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

function renderForecast() {
    // Get city object of object most recent search
    let currentCity = JSON.parse(localStorage.getItem("cityHistory"))[0];
    // This lists the days used
    let dates = [new Weather(dayjs()), new Weather(dayjs().add(1, 'day')), new Weather(dayjs().add(2, 'day')), new Weather(dayjs().add(3, 'day')), new Weather(dayjs().add(4, 'day')), new Weather(dayjs().add(5, 'day'))]
    for (let i = 1; i < dates.length; i++) {
        $(`#day-${i}-day`).text(dates[i].day.format("ddd"))
        $(`#day-${i}-title`).text(dates[i].day.format("DD/MM/YY"))
    }
    // Set the main title
    $('#day-0-day').text(`${dayjs().format('dddd')}`);
    $('#day-0-title').text(`${currentCity.name} (${dayjs().format('DD/MM/YY')})`);
    let weatherURL = (lat, lon, apiKey) => `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    $.ajax({
        url: weatherURL(currentCity.lat, currentCity.lon, APIKEY),
        method: "GET"
    }).then((response) => {
        let colorClass = ["cold", "mild", "warm", "hot"]
        let colorCode = [['var(--start)','var(--cold)'],['var(--cold)','var(--mild)'],['var(--mild)','var(--warm)'],['var(--warm)','var(--hot)']];
        let gradient = (index) => `: linear-gradient(to right, ${colorCode[index][0]} , ${colorCode[index][1]})`;
        let backgroundColor = (index) => `${colorCode[index][1]}`
        response.list.forEach(element => {
            for (let i = 0; i < dates.length; i++) {
                if (dayjs(element.dt * 1000).isSame(dates[i].day, 'day') ){
                    dates[i].addIcon(element.weather[0].icon);
                    dates[i].addTemp(element.main.temp);
                    dates[i].addWindSpeed(element.wind.speed);
                    dates[i].addHumidity(element.main.humidity);
                }
            }
            // If the time is between 9pm and 12am there are no results in today. Add the first results from the next day.
            if (dates[0]._temp.length === 0) {
                dates[0].addIcon(dates[1]._icon[0]);
                dates[0].addTemp(dates[1]._temp[0]);
                dates[0].addWindSpeed(dates[1]._windSpeed[0]);
                dates[0].addHumidity(dates[1]._humidity[0]);
            }     
        })
        // Use the Weather object to display info
        dates.forEach((element, index) => {
            $(`#day-${index}-card`).removeClass().addClass(`forecast-card card ${colorClass[element.tempCategory]}`)
            $(`#day-${index}-img`).attr("src", element.icon);
            $(`#day-${index}-temp-value`).text(element.highTemp.toFixed(1));
            $(`#day-${index}-wind-value`).text(element.meanWindSpeed.toFixed(1));
            $(`#day-${index}-humidty-value`).text(element.meanHumidity.toFixed(1));
        })
    });
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

