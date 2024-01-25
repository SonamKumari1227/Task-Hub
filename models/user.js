
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: String,
    favFood: String
});

const User = new mongoose.model('User', userSchema);
module.exports = User;