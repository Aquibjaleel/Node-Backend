const mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
    name : {type: String,required:false},
    author : String
});

mongoose.model( 'Book',bookSchema)
