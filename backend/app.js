require('dotenv').config()

const mongoose = require('mongoose');;
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors'); 

const authRoutes = require("./routes/auth");

// db connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("CONNECTED TO DATABASE");
}).catch(() => {
    console.log("Oops CAN'T CONNECT TO DATABASE");
});

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api", authRoutes);

// port
const port = process.env.PORT || 8000;

// starting server
app.listen(port, ()=>{
    console.log(`App is running at ${port}`);
})