const express = require("express");

const app = express();

const port = 7000;

app.get('/', (req,res) => {
    return res.send("Home Page");
});

const admin = (req,res) => res.send("Admin dashboard")

const isAdmin = (req, res, next) => {
    console.log("isAdmin is called");
    a = true
    if (a) next();
}

const isloggedIn = (req, res, next) => {
    console.log("isloggedIn is called");
    next();
}

app.get('/admin', isloggedIn, isAdmin, admin);

app.get('/login', (req,res) => res.send("Login Page"));

app.get('/signout', (req,res) => res.send("you are signed out"));

app.get('/siddhi', (req,res)=> res.send("Siddhi is using this web-app"));

app.listen(port, ()=> {
    console.log(`Server up and running at ${port}`)
});