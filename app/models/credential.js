const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    confirm: {
        type: String,
        required: true
    }

},{ timestamps: true})

const User = mongoose.model('hrUser', userSchema )
module.exports = User

