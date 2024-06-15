var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")

const passport = require('passport');


const postSchema = new mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "user",
  },
  title:String,
  description : String,
  image : String,


});


module.exports =  mongoose.model("post" , postSchema);


