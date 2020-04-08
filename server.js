'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

app.get('/', (request, response) => {
  response.send('Home Page!');
});

// Route Definitions
app.get('/location', locationHandler);
// app.get('/weather', weatherHandler);
// app.get('/trail', trailHandler);


// Route Handlers


function locationHandler(req, res) {

  const city = req.query.city;
  getLocation(city)
  .then(locationData=> res.status(200).json(locationData));

}

function getLocation(city) {
  let key = process.env.LOCATION_API_KEY;
  const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;


  return superagent.get(url)
  .then(geoData =>{
    const locationData = new Location(city, geoData.body);
    return locationData;
  })



}

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}



app.get('/weather', weatherHandler);
function weatherHandler(req, res) {
  let city = req.query.search_query;
  console.log(',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,', city)
  let key = process.env.WEATHER_API_KEY
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  superagent.get(url).then((wData) => {
    console.log(wData);
    res.status(200).json(wData.body.data.map((day) => new Weather(day)));
  });
}



function Weather(day) {
  this.forecast = day.weather.description;
  this.datetime = day.valid_date;
}



// function trailHandler(req,res){
// const lat = req.query.latitude  
// console.log('lat is' , lat)  
// const lon =req.query.longitude
// console.log('lon is' , lon)  

// getTrails(lat,lon)
// .then(arrayOfTrail => res.status(200).json(arrayOfTrail));




app.get('/trails',(req,res) =>{
  const lat = req.query.latitude;
  const lon = req.query.longitude;
  const key = process.env.TRAIL_API_KEY;

  getTrails(key,lat,lon)
    .then(arrayOfTrail => res.status(200).json(arrayOfTrail));
});
function getTrails(key,lat,lon){
  let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=100&sort=Distance&key=${key}`;
  return superagent.get(url)
    .then(tData => {
      let arrayOfTrail = tData.body.trails.map(majd => {
      console.log(arrayOfTrail)
      })
      return arrayOfTrail;
    });
}


function Trails(tData) {
  this.name = tData.name;
  this.location = tData.location;
  this.length = tData.length;
  this.stars = tData.stars;
  this.summary= tData.summary;
  this.trail_url= tData.url;
  this.conditions= tData.conditionDetails;
  this.condition_date= tData.conditionDate.slice(0,10);
  this.condition_time=tData.conditionDate.slice(12,19);
}



app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
