const User = require("../models/user");
const { check, validationResult } = require('express-validator');

exports.signup= (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    const user = new User(req.body);
    console.log(req.body);
    user.save( (err, user) => {
        if(err){
            console.log(err);
            return res.status(400).json({
                err: "NOT able to save user in db"
            });
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
}

exports.signout = (req, res) =>{
    res.json({
        message: " user has signed out"
    });
}