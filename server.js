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
app.get('/weather', myMoviehandler);
















app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
