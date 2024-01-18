const mongoose = require("mongoose")
const adminschema = new mongoose.Schema({
    Image:String,
    Fname:String,
    Lname:String,
    Username:String,
    Number:Number,
    Email:String,
    password:String,
    userId:String,
    Role:String,
})
module.exports=new mongoose.model("Admin",adminschema)
