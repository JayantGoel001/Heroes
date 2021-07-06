const mongoose = require('mongoose');

const uri = "mongodb://localhost/Heroes";

mongoose.connect(uri,{useNewUrlParser : true, useUnifiedTopology :true}).then( _ =>{
    console.log(`Mongoose Connected ${uri}`);
});
