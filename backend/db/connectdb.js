const mongoose = require('mongoose')

async function connect() {
    try{
        await mongoose.connect('MongoDB_URI');
        console.log('Database Connected');
    }catch(error){
        console.log('Error While Connecting to Database'); 
    }
}
module.exports = connect;