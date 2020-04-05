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
server.use('*',(request,response)=>{
    response.status(404).send('PAGE NOT FOUND')
});
server.use((error,request,response)=>{
    response.status(500).send(error);
})

// localhost:/3000/location?city=Lynwood
