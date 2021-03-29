const  mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = ({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastName: {
        type: String,
        required: false,
        maxlength: 32,
        trim: true
    },
    
    userinfo: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    
    password: {
        type: String,
        trim: true
    },
    
    salt: String,
    
    role: {
        type: Number,
        default: 0
    },

    purchases: {
        type: Array,
        default: []     
    }
}); 

module.exports = mongoose.model("User" , userSchema);