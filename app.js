//jshint esversion:6
require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
const ejs = require("ejs")

const app = express();

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true})

const userSchema = mongoose.Schema({
    email:String,
    password:String
});

// const secret = "ThisIsMyLittleSecret";
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User",userSchema);

app.get("/", function(req, res){
    res.render("home")
});

app.get("/register", function(req, res){
    res.render("register")
});

app.post("/register", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({
        email:username,
        password:password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("User registered successfully!");
            res.render("secrets");
        }
    })
});

app.get("/login", function(req, res){
    res.render("login")
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser.password === password){
                res.render("secrets");
                console.log("User logged in successfully!");
            }
        }
    })
});

app.listen(3000, function(){
    console.log("Succefully listening on port 3000");
});