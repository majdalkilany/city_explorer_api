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
//                                            Trails_API
// =======================================================================================================



    function trailshandler(req,res){
    const lat = req.query.latitude;
    const lon = req.query.longitude;
    const key = process.env.TRAIL_API_KEY;
  
    getTrails(key,lat,lon)
      .then(arrayOfTrail => res.status(200).json(arrayOfTrail));
    }

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

  module.exports = trailshandler