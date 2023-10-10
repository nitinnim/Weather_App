const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initial variables

const API_KEY = "91b425de27a981d167914aea4704b791";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

// ===========> CHANGE TABS <================
function changeTab(clickedTab) {
    if(clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }

    }
}

userTab.addEventListener("click",() => {
    changeTab(userTab);
})

searchTab.addEventListener("click",() => {
    changeTab(searchTab);
})


// ===========> API CALLING AND RENDERING FUNCTION <================
function getFromSessionStorage() {

    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat,lon} = coordinates;

    grantAccessContainer.classList.remove("active");

    loadingScreen.classList.add("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();

        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");
        // console.log("above render calling")
        renderweatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("ERRRO FOUND(fetchUserWeatherInfo) ---> ",err);
    }
}

function renderweatherInfo(weatherInfo) {

    // console.log("renderweatherInfo 1")
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");

    cityName.innerText = weatherInfo?.name;
    // console.log("renderweatherInfo 2")
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    // console.log("down")
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    // console.log("renderweatherInfo 3")
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    // console.log("renderweatherInfo 4")
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;

}

// ===========> Get current location of user and display <================

function getUserCoordinates() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessBtn = document.querySelector("[data-grantAccess");
grantAccessBtn.addEventListener("click",getUserCoordinates);

// ===========> Search through location <===============
const input = document.querySelector("[data-searchInput]");

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    // console.log("Inside fetchSearchWeatherInfo")
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // console.log("fetchSearchWeatherInfo inside")
        renderweatherInfo(data);
    }
    catch(err){
        
        console.log("ERROR FOUND(fetchSearchWeatherInfo) ---> ",err);
    }

}

searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName = input.value;

    if(cityName==="") return;
    else fetchSearchWeatherInfo(cityName);

})