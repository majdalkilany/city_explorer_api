'use strict '

const express = require('express');

const cors =require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors());

server.listen(PORT,()=>{ 
    console.log( `my port ${PORT}`)
    
})



server.get('/',(request,response)=>{ 
    response.status(200).send('done')
    
})

// localhost:3000/location?city=Lynnwood
server.get('/location', (req, res) => {
    const geoData = require('./data/geo.json');
    const city = req.query.city;
    const locationData = new Location(city,geoData);
    res.send(locationData);

})

function Location (city,geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

// localhost:3000/weather

server.get('/weather', (req, res) => {
    const weatherFile = require('./data/weather.json');
    let arrOfwearthe=[];
    weatherFile.data.forEach((val, i) => {
        let description = val.weather.description;
        let date = val.valid_date;
        let majd = new weatherData(description, date);
        arrOfwearthe.push(majd);

    })
    res.send(arrOfwearthe);
    

})

function weatherData(description, date) {
    this.forecast = description;
    this.time=date;

}
// localhost:3000/anything
server.use('*', (req, res) => {
    res.status(404).send('NOT FOUND');
});

server.use((error, req, res) => {
    res.status(500).send(error);
})

