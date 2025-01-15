const mongoose = require('mongoose');

// Connect to MongoDB
const user = mongoose.Schema({
    email:"string",
    password:"string"
})

module.exports = mongoose.model('user', user);
