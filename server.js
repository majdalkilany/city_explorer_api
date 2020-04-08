'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
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

app.get('/all',(request,response)=>{
  let SQL = 'SELECT * FROM locationIq';
  client.query(SQL)
  .then(results =>{
      response.status(200).json(results.rows);
  })
  // .catch (error => errorHandler(error));
})


// to add data 



function newDatabase(city,geoData){
  let search_query = city;
  let formatted_query = geoData[0].display_name;
  let latitude = geoData[0].lat;
  let longitude = geoData[0].lon;
  let SQL = 'INSERT INTO locationIq (search_query,formatted_query_IQ,latitude_IQ,longitude_IQ)  VALUES ($1,$2,$3,$4)';
  let safeValues = [search_query,formatted_query,latitude,longitude];
  client.query(SQL,safeValues).then()
}

// http://localhost:3030/add?city=formatted_query&lat=latitude&lon=longitude
app.get('/add',(request,response)=>{

  let search_query = request.query.city;
  let formatted_query = search_query;
  let latitude = request.query.lat;
  let longitude = request.query.lon;

  let SQL = `INSERT INTO locationIq(search_query,formatted_query_IQ,latitude_IQ,longitude_IQ) VALUES($1,$2,$3,$4) `;

  let safeValues = [search_query,formatted_query,latitude,longitude]
  client.query(SQL,safeValues)
  .then(results=>{
    response.status(200).json(results.rows)
  })
  // .catch (error=>errorHandler(error));

})



// error Routs========================
app.get('*',notFoundHandler)
app.use(errorHandler)

function errorHandler(error, request,response){
  response.status(500).send(error);
  
}
function notFoundHandler(error, request,response){
  response.status(404).send('PAGE NOT FOUND');
  
}


function locationHandler(req, res) {

  const city = req.query.city;
  getLocation(city)
  .then(locationData=> res.status(200).json(locationData));

}


app.get('/location',(req,res) =>{

  const city = req.query.city;
  const key = process.env.LOCATION_API_KEY;


  checkLocation(city,key)
    .then( (locationData)=> {
      res.status(200).json(locationData);
    })
});





function getLocation(city) {
  let key = process.env.LOCATION_API_KEY;
  const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;


  return superagent.get(url)
  .then(geoData =>{
    newDatabase(city,geoData.body);

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
        return new Trails(majd);
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


function checkLocation(city,key){
  let SQL = `SELECT * FROM locationIq  where search_query='${city}' `;
  return client.query(SQL)
    .then(results =>{
      if(results.rows.length){
        return results.rows[0];
      }else{
        return getlocation(city,key)
          .then(locationData => {
            return locationData;
          })
      }
    })
}













client.connect()
.then(()=>{
  app.listen(PORT, () => console.log(`App is listening on ${PORT}`));

})
