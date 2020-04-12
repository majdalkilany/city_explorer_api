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


const mylocationHandler = require('./location.js')

const myweatherHandler = require('./weather.js')

const mytrailhandler = require('./trails')

const myMoviehandler = require('./movie.js')



app.get('/location', mylocationHandler);
app.get('/weather', myweatherHandler);
app.get('/trails',mytrailhandler)
app.get('/movie', myMoviehandler);
app.get('./yelp', yelpHandler);




//  ======================================================================================================
//                                            yelp API 
// =======================================================================================================
function yelpHandler(request, response) {
  const city = request.query.search_query;
  const latitude = request.query.latitude;
  const longitude = request.query.longitude;
  const key = YELP_API_KEY
   return superagent.get(
      `https://api.yelp.com/v3/businesses/search?location=${city}`
  )
      .set({ 'Authorization':`Bearer ${key}` })
      
      .then(apiData => {
          // console.log(apiData);
          let yelpDataArr = [];
          apiData.body.businesses.map(locYelp => {
              const yelpEnteries = new LocationYelp(locYelp);
              yelpDataArr.push(yelpEnteries);
          })
          // console.log(moviesDataArr[0])
          response.status(200).json(yelpDataArr);
      })

}


function LocationYelp(yelpData) {
  this.title = yelpData.name;
  this.image_url = yelpData.image_url;
  this.price = yelpData.price;
  this.rating = yelpData.rating;
  this.url = yelpData.url;
  // console.log(this)
}














app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
