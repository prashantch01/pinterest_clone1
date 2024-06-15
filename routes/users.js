var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")
const plm = require("passport-local-mongoose");
const passport = require('passport');



mongoose.connect("mongodb://127.0.0.1:27017/pin");


const userSchema = new mongoose.Schema({
  username : String ,
  name:String,
  email : String,
  password : String,
  contact : Number , 
  profileimage : String , 
  boards : {
    type : Array,
    default : [],
  },
  posts : [  {  
    type : mongoose.Schema.Types.ObjectId ,
    ref:"post"
  
  }
]

});




userSchema.plugin(plm)

module.exports =  mongoose.model("user" , userSchema);


