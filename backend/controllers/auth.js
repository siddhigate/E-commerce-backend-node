const User = require("../models/user");
const { check, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

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

exports.signin = (req, res) => {
    const {email, password} = req.body;
  
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    User.findOne({email}, (err, user)=> {
        if(err || !user){
            return res.status(400).json({
                email: "User not found"
            });
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password do not match" 
            });
        }

        // create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET);

        // put token in cookie
        res.cookie("token", token, {expire: new Date() + 8888});

        // send response to frontend
        const {_id, name, email, role} = user;
    
        return res.json({ token, user : { _id, name, email, role}
        });
    });
}

exports.signout = (req, res) =>{
    
    res.clearCookie("token");

    res.json({
        message: "Signed out successfully"
    })
}