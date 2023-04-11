require('dotenv').config();
var express = require('express');
var app = express();
const mongoose = require("mongoose");



exports.connection = mongoose.connect(process.env.MONGODB)
.then(()=>{
     console.log('database connected successfully')
})
.catch((err)=>{
    console.log(`Error connecting the data base. n${err}`);
})