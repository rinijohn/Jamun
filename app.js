//jshint esversion:6
require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const ejs = require("ejs")
const bcrypt = require("bcrypt")
const saltRounds = 10;

const app = express();

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true})

const userSchema = mongoose.Schema({
    email:String,
    password:String
});


const User = mongoose.model("User",userSchema);

app.get("/", function(req, res){
    res.render("home")
});

app.get("/register", function(req, res){
    res.render("register")
});

app.post("/register", function(req, res){
    const username = req.body.username;
    // const password = md5(req.body.password);
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        if(err){
            console.log(err);
        }else{       
            const newUser = new User({
                email:username,
                password:hash
            });
            newUser.save(function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("User registered successfully!");
                    res.render("secrets");
                }
            })
        }
    });
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
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result == true){
                        console.log("User logged in successfully!");
                        res.render("secrets");
                    }
                });
            }
        }
    })
});

app.listen(3000, function(){
    console.log("Succefully listening on port 3000");
});