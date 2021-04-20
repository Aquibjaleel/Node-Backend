const mongoose = require('mongoose');

var carSchema = new mongoose.Schema({
    name : {type: String,required:false},
    color : String,
    model: String,
    year: Number
});

mongoose.model( 'Car',carSchema)