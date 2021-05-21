require('dotenv').config()

const mongoose = require('mongoose');;
const express = require('express');

const app = express();

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("CONNECTED TO DATABASE");
}).catch(() => {
    console.log("Oops CAN'T CONNECT TO DATABASE");
});

const port = 8000;

app.listen(port, ()=>{
    console.log(`App is running at ${port}`);
})