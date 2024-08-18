const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcon = document.querySelector(".weather-part img");
let api;
//Get Value From User to Search in Api
inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});
// Get User Current Location
locationBtn.addEventListener("click", (e) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("This Browser Not Support Geolocation api");
  }
});
// On Success Function
function onSuccess(position) {
  //getting lat and lon of the user device from coords obj
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=b7597bf03f08e3eeacf3656c92d9dc43`;
  fetchData();
}
//On Error Function
function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}
function fetchData() {
  infoTxt.innerText = "Getting Weather Details...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((resonse) => resonse.json())
    .then((result) => weatherDetails(result));
}
//Fetch api data from city name
function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=b7597bf03f08e3eeacf3656c92d9dc43`;
  fetchData();
}
//Return Weather Details from api
function weatherDetails(info) {
  if (info.cod == 404) {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} isn't valid city name`;
  } else {
    //get values from info
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    //make image dynamic
    if (id > 800) {
      wIcon.setAttribute("src", "imgs/cloud.svg");
    } else if (id == 800) {
      wIcon.setAttribute("src", "imgs/sun.svg");
    } else if (id >= 701 && id <= 781) {
      wIcon.setAttribute("src", "imgs/wind.svg");
    } else if (id >= 600 && id <= 622) {
      wIcon.setAttribute("src", "imgs/snow.svg");
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      wIcon.setAttribute("src", "imgs/rain.svg");
    } else if (id >= 200 && id <= 232) {
      wIcon.setAttribute("src", "imgs/electric cloud.svg");
    }
    //pass these values to html elements
    wrapper.querySelector(".temp .nump").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".feels .temp .nump").innerText =
      Math.floor(feels_like);
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".humidity .details .nump").innerText = `${Math.floor(
      humidity
    )}%`;

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
    console.log(info);
  }
}
const arrow = document.querySelector("header i");

arrow.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
