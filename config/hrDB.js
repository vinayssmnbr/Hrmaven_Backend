require('dotenv').config();
var express = require('express');
var app = express();
const mongoose = require("mongoose");



exports.connection = mongoose.connect(process.env.MONGODB)
.then(async ()=>{
    await console.log('database connected successfully')
})
.catch(async (err)=>{
   await console.log(`Error connecting the data base. n${err}`);
})