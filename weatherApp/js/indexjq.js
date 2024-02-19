$(function () {
    var deboundsTimeout = null;
    $('#searchInput').on('keypress', function() {
        if (event.key === 'Enter') {
            clearTimeout(deboundsTimeout)
            getWeather(this.value)
        }
    })

    $('#searchBtn').on('click', function() {
        getWeather($('#searchInput').val())
    })
})

function getWeather(city) {
    if (!city) {
        return
    }

    hideComponent('.error-city')
    fetchWeatherFromApi(city)
}

function fetchWeatherFromApi(city) {
    const apiKey = '36fe836bcdea208f40622009994a3ea4'
    let ajaxRequest = new XMLHttpRequest()

    ajaxRequest.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`, true)
    ajaxRequest.timeout = 5000 
    ajaxRequest.ontimeout = (e) => onApiError()
    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState == 4) {
            if (ajaxRequest.status === 200) {
                buildWeather(JSON.parse(ajaxRequest.responseText))
            }
            else {
                onApiError()
            }
        }
    }
    ajaxRequest.send()
}

function buildWeather(apiResponse) {
    $('#weatherIcon').attr('src', `http://openweathermap.org/img/wn/${apiResponse.weather[0].icon}.png`)
    $('#temperature').text(Math.round(apiResponse.main.temp) + '\u2103')
    $('#city').text(apiResponse.name)
    $('#humidity').text(apiResponse.main.humidity + '%')
    $('#windSpeed').text(apiResponse.wind.speed + ' Km/h')
    showComponent('.weather')
}

function onApiError() {
    showComponent('.error-city')
}

function showComponent(jQueryComponent) {
    return $(jQueryComponent).removeClass('hidden')
}

function hideComponent(jQueryComponent) {
    return $(jQueryComponent).addClass('hidden')
}



