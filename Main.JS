// Get latitude and longitude using HTML5 Geolocation

let geo = navigator.geolocation;

let myGoogleKey = config.GOOGLE_MAPS_KEY;
let myDarkSkyKey = config.DARKSKY_KEY;
var daysofweek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
function success(position) {
  lat = position.coords.latitude;
  lng = position.coords.longitude;
  accuracy = position.coords.accuracy;

  console.log('Your current position is:');
  console.log(`Latitude : ${lat}`);
  console.log(`Longitude: ${lng}`);
  console.log(`More or less ${accuracy} meters.`);

  findCity();

  getWeather();
  currentlocaltime();
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Use Gooogle's maps api and fetch to find the city using the lat and lng found using HTML5 geolocation.
function findCity() {

  const Url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${myGoogleKey}`;

  fetch(Url)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        // console.log(data);
        // console.log(data.results[0].address_components);
        let locals = data.results[0].address_components;
        // console.log(locals);
        // Use forEach to cycle and .includes to cycle through all the arrays in the json data returned. 
        locals.forEach(local => {
          if (local.types.includes('locality') && local.types.includes('political')) {
            cityName = local.long_name;
            console.log(cityName);
            document.querySelector('.city').innerText = cityName;
            document.querySelector('.location').remove();
          }
        });
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

}

// Get weather using fetch and DarkSky api with cors-anywhere,

function getWeather() {

  let temperature = document.querySelector('.temperature');
  let forcastSummary = document.querySelector('.forcast_summary');


  const weatherUrl = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${myDarkSkyKey}/${lat},${lng}`;

  fetch(weatherUrl, {
    credentials: 'same-origin' 
  })
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('WTH!! Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
          // console.log(data);
          // console.log(data.currently.time)
          // console.log(data.currently.temperature);
          // console.log(data.minutely.summary)
          // console.log(data.currently.summary);
          // console.log(data.currently.icon);

          temperature.innerHTML = data.currently.temperature + "<span>&#8451;</span>";
          forcastSummary.innerText = data.currently.icon;
          console.log(data.currently.icon)

          console.log(typeof(data.currently.summary));

          // image.classList.add('.wi .wi-day-sunny')
          image = document.querySelector('.wi');

          if (forcastSummary = 'partly-cloudy-day') {
            image.classList.add('wi-day-cloudy');
          } else if (forcastSummary = 'day-sunny') {
            image.classList.add('wi-day-sunny');
          }
          

          // Set time using Moment.js
          let time = document.querySelector('.time');

          setInterval(() => {
            now = moment().format(`hh:mm:ss A`);
            time.innerText = now;
          }, 1000);
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });

}

geo.getCurrentPosition(success, error);
function currentlocaltime(){
    var targetDate = new Date() // Current date/time of user computer
    var timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60 // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
    var apicall = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${myGoogleKey}';
 
    var xhr = new XMLHttpRequest() // create new XMLHttpRequest2 object
    xhr.open('GET', apicall) // open GET request
    xhr.onload = function(){
        if (xhr.status === 200){ // if Ajax request successful
            var output = JSON.parse(xhr.responseText) // convert returned JSON string to JSON object
            console.log(output.status) // log API return status for debugging purposes
            if (output.status == 'OK'){ // if API reports everything was returned successfully
                var offsets = output.dstOffset * 1000 + output.rawOffset * 1000 // get DST and time zone offsets in milliseconds
                var localdate = new Date(timestamp * 1000 + offsets) // Date object containing current time of target location
                var refreshDate = new Date() // get current date again to calculate time elapsed between targetDate and now
                var millisecondselapsed = refreshDate - targetDate // get amount of time elapsed between targetDate and now
                localdate.setMilliseconds(localdate.getMilliseconds()+ millisecondselapsed) // update localdate to account for any time elapsed
                setInterval(function(){
                    localdate.setSeconds(localdate.getSeconds()+1)
                    console.log = localdate.toLocaleTimeString() + ' (' + daysofweek[ localdate.getDay() ] + ')'
                }, 1000)
            }
        }
        else{
            alert('Request failed.  Returned status of ' + xhr.status)
        }
    }
    xhr.send() // send request
}

