const mongoose = require("mongoose")
const userschema = new mongoose.Schema({
    Image:String,
    Fname:String,
    Lname:String,
    Username:String,
    Email:String,
    password:String, 
    userId:String,
    Role:String,
})
module.exports=new mongoose.model("User",userschema)
