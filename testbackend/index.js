const express = require("express");

const app = express();

const port = 7000;

app.get('/', (req,res) => {
    return res.send("Home Page");
});

app.get('/login', (req,res) => res.send("Login Page"));

app.get('/signout', (req,res) => res.send("you are signed out"));

app.get('/siddhi', (req,res)=> res.send("Siddhi is using this web-app"));

app.listen(port, ()=> {
    console.log(`Server up and running at ${port}`)
});