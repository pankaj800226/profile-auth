const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },

    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true,
    },

    photo: {
        type: String,
        require: true,
    },


})

const authModule = mongoose.model('User', authSchema)

module.exports = authModule