const User = require("../models/user")
const { check, validationResult } = require('express-validator');

exports.getUserById = (req, res, next, id) =>{
    User.findById(id).exec((err, user) => {

        if(err || !user){
            return res.status(400).json({
                error: "No user was found in DB"
            })
        } 

        req.profile = user;
        next();
    })
}

exports.getUser = (req, res) =>{

    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;

    return res.json(req.profile);
} 

exports.updateUser = (req,res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err,user) => {

            if(err || !user){
                return res.status(400).json({
                    error: "Update not sucessful"
                })
            }
        
            user.salt = undefined;
            user.encry_password = undefined;
            user.createdAt = undefined;
            user.updatedAt = undefined;

            return res.json(user);
        }
    )
}