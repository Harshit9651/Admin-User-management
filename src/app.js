const express= require("express");
const app = express();
const port = process.env.PORT|| 3000;
const cookieParser = require('cookie-parser');
const bycrpt = require("bcrypt");
const session = require("express-session");
const mongodbsession = require("connect-mongodb-session")(session)
const path = require("path");
const User = require("./models/user.js")


app.use(cookieParser());

//const authenticate = require("./dhdhd/bfbbyf.js");


require("./db/connection.js")
app.listen(port,()=>{
    console.log("server run successfully")
})
const store = new mongodbsession({
    uri:'mongodb://127.0.0.1:27017/admin-management',
    collection:"mysessions",
  })
  
  app.use(session({
    secret:"this is my first secrectin cookie",
    resave:false,
    saveUninitialized:false,
    store:store,
  }))

  /*
  const isAuth = (req,res,next)=>{
    if(req.session.isAuth){
      next();
    }else{
      res.redirect("listings/login.ejs");
    }
  }
  */
  
  
  const multer = require('multer');
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  const cloudinary = require('cloudinary').v2;
  
  
  
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: 'drxgaesoh',
    api_key: '911397189256837',
    api_secret: '3u2KB4BndKIcxurUbB7hz9Lsy2s'
  });
  
  // Configure MongoDB connection
  
  // Create a simple mongoose schema
  
  
  
  
  // Configure multer to use Cloudinary as storage
  const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      folder: 'uploads', // Cloudinary folder where you want to store files
      allowedFormats: ['jpg', 'png'],
  });
  const mongoose = require("mongoose");
  const upload = multer({ storage: storage });//kha save krna h 
  //multer({ storage: storage }).array('files', 5); // 'files' is the field name for your file input, and 5 is the maximum number of files
  // Set up a simple route for file upload
  //const upload = multer({ storage: storage }).array('files', 6);
  
app. use(express.json());// for parsing 
app.use(express.urlencoded({extended:true}))//data by id aa jaye 
app.set("view engine","ejs");
const static_path = path.join(__dirname,"../views");//pura path dena hota hai 
app.use(express.static(static_path));
//const methodoverride = require("method-override"); // for put patch and delete method
//app.use(methodoverride("_method"));
const ejsmate = require("ejs-mate");
app.engine("ejs",ejsmate)

app.use(express.static(path.join(__dirname,"../public")));

const Admin = require("./models/admin.js");


const bodyParser = require('body-parser');

const methodoverride = require("method-override"); // for put patch and delete method
const { execArgv } = require("process");
const { AsyncLocalStorage } = require("async_hooks");
app.use(methodoverride("_method"));
let userEmail;
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
   // return res.redirect('/login');
   return res.redirect("/loginpage")
  }
  next();
};
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.render('listings/adminlogin.ejs');
  }
};
app.get("/loginpage",(req,res)=>{
  res.render("listings/optionlogin.ejs")
})
app.get('/profile', requireLogin, isAuthenticated, async (req, res) => {
  try {
    const { userId, Role } = req.session.user;

    if (Role === 'user') {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }

      // Render user profile page
      return res.render('listings/user-profile.ejs', { profile: user });
    } else if (Role === 'Admin') {
      const admin = await Admin.findById(userId);
      if (!admin) {
        return res.status(404).send('Admin not found');
      }
console.log(admin)
      // Render admin profile page
      return res.render('listings/admin-profile.ejs', {admin });
    } else {
      // Invalid role
      return res.status(403).send('Invalid role');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});



app.get("/",(req,res)=>{
    res.render("listings/index.ejs")
})

app.get("/register-Admin",(req,res)=>{
    res.render("listings/adminregister.ejs");

})
app.get("/crete-user",(req,res)=>{
  res.render("listings/createuser.ejs")
 })

app.post("/register-admins",upload.fields([
    { name: 'Image', maxCount: 1 }])
    ,async(req,res)=>{
    const{Image,Fname,Lname,Email,Username,Number,password,userId,aadmin} = req.body;
    const IMAGE = await uploadToCloudinary(req.files['Image'][0]);
    
 const saltRounds = 10;
 const hashedPassword = await bycrpt.hash(password, saltRounds);
console.log("Admin Id is "+userId)
console.log(hashedPassword);
const admin  = new Admin({
    Image:IMAGE,
    Fname,
    Lname,
    Email,Username,Number,password:hashedPassword,userId,Role:aadmin
})


const newAdmin = await admin.save();

console.log(newAdmin);
res.redirect("/crete-user")
});

 app.post("/register", upload.fields([
  { name: 'Image', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files || !req.files['Image']) {
      return res.status(400).json({ error: 'Image file not provided' });
    }

    const IMAGE = await uploadToCloudinary(req.files['Image'][0]);

    const { Fname, Lname, Email, password, Username, userId,user} = req.body;
    const hashedPassword = await bycrpt.hash(password, 10);
    console.log(user)

    const Users = new User({
      Image: IMAGE,
      Fname,
      Lname,
      Email,
      Username,
      password: hashedPassword,
      userId,
      Role:user
    });

    const newUser = await Users.save();
    console.log(newUser);
    console.log(userId);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/users", async(req,res)=>{
  const user = await User.find({})

  res.render("listings/users.ejs",{user})
})

// Handle delete request
app.delete("/userdelete/:_id",async(req,res)=>{
  const {_id} =  req.params;
const userfind  = await User. findByIdAndDelete(_id)
console.log(userfind);
res.redirect("/users")

})
app.get("/userlogin",(req,res)=>{
  res.render("listings/userlogin.ejs")
})
app.post("/login-user",async(req,res)=>{
  let{password,userId} = req.body;
 
  const finduser =  await User.findOne({userId})
  if(finduser==null){
   
    res.redirect("/");
  }
  else{
  
    const hashpass = await bycrpt.compare(password, finduser.password);
    console.log(hashpass);
  

 
    if(  finduser.userId===userId ){       
console.log("success")
req.session.user = { Role,userId: finduser._id};
       res.redirect("/");
      } 
     
    }
  });
  app.get("/adminlogin",(req,res)=>{
    res.render("listings/adminlogin.ejs")
  })
app.post("/login-admin",async(req,res)=>{
  let{password,userId,Username} = req.body;
 
  const findAdmin =  await Admin.findOne({userId})
  if(findAdmin==null){
   
    res.redirect("/adminlogin");
    console.log("hello")
  }
  else{
  
    const hashpass = await bycrpt.compare(password, findAdmin.password);
    console.log(hashpass);

 
    if(  hashpass && findAdmin.userId===userId ){       
console.log("success")

req.session.user = { Role:findAdmin.Role,userId: findAdmin._id};
const user = await User.find({});
       res.render("listings/users.ejs" ,{user})
      } 
      else{
        res.redirect("/adminlogin")
      }
     
    }
})
  

app.get('/userss', isAuthenticated, async(req, res) => {
  if (req.session && req.session.user ) {
    const user = await User.find({});
res.render("listings/users.ejs",{user})
  
  } else {
  res.redirect("/adminlogin");

  }
});
app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error destroying session');
    } else {
      res.redirect("/");
    }
  });
});




    const uploadToCloudinary = async (file) => {
        if (file && file.path) {
          //const result = await cloudinary.uploader.upload(file.buffer.toString('base64'));
          const result = await cloudinary.uploader.upload(file.path);
          return result.secure_url;
        } else {
          throw new Error('File buffer is undefined or null');
        }
    
      };
     
     
   
