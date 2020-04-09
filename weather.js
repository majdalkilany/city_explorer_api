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
//                                            weather API 
// =======================================================================================================
function weatherHandler(req, res) {
  let city = req.query.search_query;
  // console.log(',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,', city)
  let key = process.env.WEATHER_API_KEY
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  superagent.get(url).then((wData) => {
    // console.log(wData);
    res.status(200).json(wData.body.data.map((day) => new Weather(day)));
  });
}



function Weather(day) {
  this.forecast = day.weather.description;
  this.datetime = day.valid_date;
}

module.exports = weatherHandler