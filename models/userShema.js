

const mongoose = require("mongoose");
const judge = require("validator");
const encrypt = require("bcrypt");

const userScema = new mongoose.Schema({
    

    email:{
        type: String,
        required: [true, "email is reqiured"],
        unique: true,
        validate: [judge.isEmail, "please use a valid email"]
    },

    password:{
        type: String,
        required: true,
        minlength: [6, "should be more than 6"],
    },

});

userScema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await encrypt.genSalt();
    this.password = await encrypt.hash(this.password, salt);
    next();
});

const USER = new mongoose.model("USER", userScema);
module.exports = USER;