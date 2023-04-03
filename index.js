// auto location get weather
const cllocation = document.getElementById("getlocation");
cllocation.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(successCallback, errorcallback);
});

// call back
var successCallback = async (position) => {
  var lat = position.coords.latitude;
  var log = position.coords.longitude;

  const api_key = "a9bc1b3b216e09167c36863379cee6a9";
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&exclude=current&appid=${api_key}`
  )
    .then(async (response) => await response.json())
    .then((data) => {
      showdata(data);
    });
  await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${log}&appid=${api_key}`,
    { method: "GET" }
  )
    .then(async (Response) => await Response.json())
    .then((data) => {
      fivehrdata(data);
      fivedaydata(data);
    });
};
// get system location ---------------------
var errorcallback = (position) => console.log(position);
navigator.geolocation.getCurrentPosition(successCallback, errorcallback);

// onpress Enter searchlocation weather------------------------------------------------------------
const hitenter = document.getElementById("locationsearch");
hitenter.addEventListener("keypress", keyenter);
function keyenter(event) {
  if (event.keyCode === 13) {
    searchloction();
  }
}
// by city selected
async function cityselected(city) {
  const api_key = "a9bc1b3b216e09167c36863379cee6a9";
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`,
    { method: "GET" }
  )
    .then((response) => response.json())
    .then((data) => {
      showdata(data);
    });
  // fetching the hourly weather
  await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}`,
    { method: "GET" }
  )
    .then((Response) => Response.json())
    .then((data) => {
      fivehrdata(data);
      fivedaydata(data);
    });
}

// handle searchlocation------------------------------------
async function searchloction() {
  // target value of input field
  var value = document.getElementById("locationsearch").value;
  if (!value) {
    Swal.fire("Please Enter location");
    successCallback(position);
  }
  const api_key = "a9bc1b3b216e09167c36863379cee6a9";
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${api_key}`,
    { method: "GET" }
  )
    .then((response) => response.json())
    .then((data) => {
      showdata(data);
      document.getElementById("locationsearch").value = " ";
    });
  // fetching the hourly weather
  await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${value}&appid=${api_key}`,
    { method: "GET" }
  )
    .then((Response) => Response.json())
    .then((data) => {
      fivehrdata(data);
      fivedaydata(data);
    });
}

// setting the value in hourly weather function ---------------
function fivehourlydata(d) {
  const container = document.getElementById("hrtimeweather");
  container.innerHTML = " ";
  d.map((item) => {
    const div = document.createElement("div");
    div.classList.add("insidediv");
    div.innerHTML = `
        <p class="font respfont">${convertTo12Hour(item.dt_txt)}</p>
         <img class="image" src="${weathericon(
           item.weather,
           item.dt_txt.substr(11, 2)
         )}"/>
         <p class="font respfont">${calculate(item.main.temp)}<sup>o</sup></p>
       `;
    container.appendChild(div);
  });
}

// getting fivadayweather handle fuction
function fivedayweather(weather) {
  const container = document.getElementById("daliyforcastdiv");
  container.innerHTML = " ";
  weather.map((item) => {
    const div = document.createElement("div");
    div.classList.add("insidediv");
    div.innerHTML = `
        <p class="font respfont">${getday(item.dt_txt)}</p>
         <img class="image" src="${dayweathericon(item.weather)}"/>
         <p class="font respfont">${calculate(item.main.temp)}<sup>o</sup></p>
       `;
    container.appendChild(div);
  });
}

//show data on main dashboard -------------------------------------------------------------------------
function showdata(data) {
  if (data.cod === "404") {
    // Check if location was not found
    Swal.fire("Location not found");
    successCallback(position);
  }
  const Mnames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  //  calculating the timezone
  const timezone = data.timezone;
  const currentDate = new Date();
  const currentUtcTimestamp =
    currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
  const locationDate = new Date(currentUtcTimestamp + timezone * 1000);

  const d = new Date(locationDate);
  var local = d.toLocaleString(); // coverting human readable formate

  let date = new Date(local);
  let hours = date.getHours(); // getting hours
  let Twentyfourfomante = date.getHours(); // converting in 12 hours formate
  hours = hours % 12 || 12;

  // setting in innerhtml
  let cond = Twentyfourfomante >= 12 ? "PM" : "AM";
  let dt = ` ${getday(date)} ${date.getDate()} | ${Mnames[date.getMonth()]} ${
    date.getMonth() + 1
  } | ${date.getFullYear()} | ${hours}:${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
  } ${cond}`;
  document.getElementById("datetime").innerHTML = dt;

  // setting weather icon based on weather conditon--------------------------
  let datee = new Date(locationDate);
  let hourss = datee.getHours();
  var i = document.getElementById("img");
  i.src = weathericon(data.weather, hourss); // calling weathicon fuction which can retur url according time and condition

  document.getElementById("cityname").innerHTML = data.name;
  document.getElementById("temp").innerHTML = calculate(data.main.temp);
  document.getElementById("humidity").innerHTML = data.main.humidity;
  document.getElementById("feelslike").innerHTML = calculate(
    data.main.feels_like
  );
  document.getElementById("wind").innerHTML = wind(data.wind.speed);
  document.getElementById("mintemp").innerHTML = calculate(data.main.temp_min);
  document.getElementById("maxtemp").innerHTML = calculate(data.main.temp_max);
  document.getElementById("sunrise").innerHTML = sunrise(data.sys.sunrise);
  document.getElementById("sunset").innerHTML = sunset(data.sys.sunset);
}

// weathericon for daliy forcast
function dayweathericon(data) {
  // accepts array length of 5
  let resutl = data.map((value) => {
    var weatherid = value.id;
    if (weatherid == 800) {
      return "https://openweathermap.org/img/wn/01d@2x.png";
    } else if (weatherid >= 801) {
      return "https://openweathermap.org/img/wn/02d@2x.png";
    } else if (weatherid >= 802) {
      return "https://openweathermap.org/img/wn/03d@2x.png";
    } else if (weatherid >= 500 && weatherid <= 504) {
      return "https://openweathermap.org/img/wn/10d@2x.png";
    } else if (weatherid >= 200 && weatherid <= 232) {
      return "https://openweathermap.org/img/wn/11d@2x.png";
    } else if (weatherid >= 300 && weatherid <= 321) {
      return "https://openweathermap.org/img/wn/9d@2x.png";
    } else if (weatherid >= 520 && weatherid <= 531) {
      return "https://openweathermap.org/img/wn/09d@2x.png";
    } else if (weatherid >= 600 && weatherid <= 622) {
      return "https://openweathermap.org/img/wn/13d@2x.png";
    } else if (weatherid >= 701 && weatherid <= 781) {
      return "https://openweathermap.org/img/wn/50d@2x.png";
    } else if (weatherid >= 803 && weatherid <= 804) {
      return "https://openweathermap.org/img/wn/04d@2x.png";
    }
  });
  return resutl;
}

// weathericon handle
function weathericon(data, hours) {
  let resutl = data.map((value) => {
    document.getElementById("weathercondition").innerHTML = value.main;
    var weatherid = value.id;

    if (weatherid == 800) {
      if (hours >= 6 && hours < 18)
        return "https://openweathermap.org/img/wn/01d@2x.png";
      else return "https://openweathermap.org/img/wn/01n@2x.png";
    } else if (weatherid >= 801) {
      if (hours >= 6 && hours < 18)
        return "https://openweathermap.org/img/wn/02d@2x.png";
      else return "https://openweathermap.org/img/wn/02n@2x.png";
    } else if (weatherid >= 802) {
      if (hours >= 6 && hours < 18)
        return "https://openweathermap.org/img/wn/03d@2x.png";
      else return "https://openweathermap.org/img/wn/03n@2x.png";
    } else if (weatherid >= 500 && weatherid <= 504) {
      if (hours >= 6 && hours < 18)
        return "https://openweathermap.org/img/wn/10d@2x.png";
      else return "https://openweathermap.org/img/wn/10n@2x.png";
    } else if (weatherid >= 200 && weatherid <= 232) {
      if (hours >= 6 && hours < 18)
        return "https://openweathermap.org/img/wn/11d@2x.png";
      else return "https://openweathermap.org/img/wn/11n@2x.png";
    } else if (weatherid >= 300 && weatherid <= 321) {
      if (hours >= 6 && hours < 18)
        return "https://openweathermap.org/img/wn/9d@2x.png";
      else return "https://openweathermap.org/img/wn/9n@2x.png";
    } else if (weatherid >= 520 && weatherid <= 531) {
      if (hours >= 6 && hours < 18)
        return "https://openweathermap.org/img/wn/09d@2x.png";
      else return "https://openweathermap.org/img/wn/09n@2x.png";
    } else if (weatherid >= 600 && weatherid <= 622) {
      if (hours >= 6 && hours < 18)
        return "https://openweathermap.org/img/wn/13d@2x.png";
      else return "https://openweathermap.org/img/wn/13n@2x.png";
    } else if (weatherid >= 701 && weatherid <= 781) {
      if (hours >= 6 && hours < 18)
        return "https://openweathermap.org/img/wn/50d@2x.png";
      else return "https://openweathermap.org/img/wn/50n@2x.png";
    } else if (weatherid >= 803 && weatherid <= 804) {
      if (hours >= 6 && hours < 18)
        return "https://openweathermap.org/img/wn/04d@2x.png";
      else return "https://openweathermap.org/img/wn/04n@2x.png";
    }
  });
  return resutl;
}

// getting fivehours weather data and returning it
function fivehrdata(datas) {
  const timezone = datas.city.timezone;
  const currentDate = new Date();
  const currentUtcTimestamp =
    currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
  const locationDate = new Date(currentUtcTimestamp + timezone * 1000);
  //  readeable formate
  const time = new Date(locationDate);
  // current time fetching form api
  const currenttime = time.getTime();

  const hourlyresult = datas.list.filter((item) => {
    const itemtime = new Date(item.dt_txt).getTime();
    // filtering the list and get the hourly weather according to current time
    if (itemtime >= currenttime) {
      return true;
    } else {
      return false;
    }
  });

  fivehourlydata(hourlyresult.slice(0, 5));
}

// getting day
function getday(days) {
  const date = new Date(days).getDay();
  const day = ["Sun", "Mon", "Tue", "Wed", "Thus", "Fri", "Sat"];
  return `${day[date]}`;
}
// getting fiveday weather data----------------------------
function fivedaydata(datas) {
  const time = new Date();
  const currdate = time.getDate();
  const nextfiveday = datas.list.filter((item, index, arr) => {
    const currdatasys = new Date(item.dt_txt).getDate();
    if (
      currdatasys > currdate &&
      arr.findIndex((i) => new Date(i.dt_txt).getDate() === currdatasys) ===
        index
    ) {
      return true;
    }
  });
  fivedayweather(nextfiveday);
}
// convert kelvin to celcius logic-------------------------------
function calculate(kelvin) {
  return Math.floor(kelvin - 273.15);
}
// wind removing decimal value ----------------------------------
function wind(wind) {
  return Math.floor(wind);
}
// sunrise and sunset  time getting logic-------------------------------------
function sunrise(value) {
  let date = new Date(value * 1000);
  return `${date.getHours()}:${date.getMinutes()}`;
}
function sunset(value) {
  let date = new Date(value * 1000);
  let hours = date.getHours();
  hours = hours % 12 || 12;
  return `${hours}:${date.getMinutes()}`;
}

// convert time into 12hr formate logic-----------------------------------
function convertTo12Hour(time) {
  let times = new Date(time).getHours();
  let str = "" + times;
  let hours = parseInt(str.substr(0, 2));
  // let minutes = h.substr(3, 2);
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return hours + ":" + "00" + " " + ampm;
}
