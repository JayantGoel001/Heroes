const mongoose = require('mongoose');

let uri = "mongodb://localhost/Heroes";
if(process.env.NODE_ENV === "PRODUCTION") {
    uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.nakgk.mongodb.net/Heroes?retryWrites=true&w=majority`;
}

mongoose.connect(uri,{useNewUrlParser : true, useUnifiedTopology :true ,useCreateIndex:true}).then( _ =>{
    console.log(`Mongoose Connected`);
}).catch(err =>{
    console.log(`Error : ${err}`);
});
const shutdown = (msg, callback)=>{
    mongoose.connection.close(()=>{
        console.log(`Mongoose Disconnected ${msg}`);
        callback();
    });
}
process.once('SIGUSR2',()=>{
    shutdown('nodemon restart',()=>{
        process.kill(process.pid,'SIGUSR2');
    });
});
process.on('SIGINT',()=>{
    shutdown('app termination',()=>{
        process.exit(0);
    });
});
process.on('SIGTERM',()=>{
    shutdown('Heroku app shutdown',()=>{
        process.exit(0);
    });
});

require('./Heroes');