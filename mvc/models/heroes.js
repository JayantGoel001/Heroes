const mongoose = require('mongoose');
const heroSchema = new mongoose.Schema({
    name:String
});



mongoose.model('Hero',heroSchema);
