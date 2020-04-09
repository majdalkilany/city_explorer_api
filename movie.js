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
//                                            movie API 
// =======================================================================================================



app.get('/movie', movieHandler);
function movieHandler(req, res) {
  const city = req.query.search_query;
  let key = process.env.MOVIE_API_KEY

  console.log(',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,', city)
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${city}`;
  console.log(url)
    superagent.get(url).then((mData) => {

      res.status(200).json(mData.body.result.map((moviesData) =>  newMovies = new Movie(moviesData)));
  });
}

function Movie(moviesData) {
  this.title = moviesData.title;
  this.overview = moviesData.overview;
  this.averge_votes = moviesData.vote_average;
  this.total_votes = moviesData.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${moviesData.poster_path}`;
  this.popularity = moviesData.popularity;
  this.released_date = moviesData.release_date;
}

module.exports = movieHandler