require('dotenv').config()

const mongoose = require('mongoose');;
const express = require('express');

const app = express();

const cookieParser = require('cookie-parser');
const cors = require('cors'); 

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("CONNECTED TO DATABASE");
}).catch(() => {
    console.log("Oops CAN'T CONNECT TO DATABASE");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT || 8000;

app.listen(port, ()=>{
    console.log(`App is running at ${port}`);
})