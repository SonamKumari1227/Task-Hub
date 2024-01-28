
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        trim: true,
        validate: {
            validator: function(value) {
                // Only check length if a password is provided
                if (value) {
                    return value.length >= 6;
                }
                return true; // Allow empty password
            },
            message: 'Password must be at least 6 characters long'
        }
    },
    cpassword: {
        type: String,
        trim: true,
        validate: {
            validator: function(value) {
                // Check if cpassword matches password (if password is provided)
                if (this.password && value) {
                    return value === this.password;
                }
                return true; // Allow empty cpassword if password is empty
            },
            message: 'Passwords do not match'
        }
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;



