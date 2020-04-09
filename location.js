'use strict'


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
//  ======================================================================================================
//                                            location_API
// =======================================================================================================
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
  
  module.exports = locationHandler