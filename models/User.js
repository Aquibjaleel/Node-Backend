const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name : {type: String,required:false},
    email : {type:String,required: true},
    hash : {type:String,required: true}
});

mongoose.model( 'User',userSchema)