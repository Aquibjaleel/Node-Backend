const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name : {type: String,required:false},
    email : {type:String,required: true},
    hash : {type:String,required: true},
    age :{type: String,required:false},
    status: {type: String,required:false},


});

mongoose.model( 'Newuser',userSchema)