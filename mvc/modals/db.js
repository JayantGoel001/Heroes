const mongoose = require('mongoose');

const uri = "mongodb://localhost/Heroes";

mongoose.connect(uri,{useNewUrlParser : true, useUnifiedTopology :true}).then( _ =>{
    console.log(`Mongoose Connected ${uri}`);
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