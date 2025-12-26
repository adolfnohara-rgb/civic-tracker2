const mongoose = require("mongoose");

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDB connected successfuly");
    }catch(err){
        console.log("failed to connect MongoDB",err);
        process.exit(1);
    }
}

module.exports = connectDB;