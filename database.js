const mongoose = require("mongoose"); // call mongoose
require("dotenv").config();// will axcess .env file

exports.connectdb= async() => {
    try{

        await mongoose.connect(
        process.env.mongodb_URI);
        console.log("MONGODB IS CONNECTED")
    }catch(err){
        console.log(err);
        process.exit(-1);
    }
}

