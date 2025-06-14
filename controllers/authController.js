const USER = require("../models/userShema");
const jwt = require("jsonwebtoken");
const encrypt = require("bcrypt");
const validator = require("validator"); 

const createUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Not a valid email, please recheck." });
        }

        const existinguser = await USER.findOne({ email });

        if (existinguser) {
            return res.status(409).json({ errors: { email: "Already an account with this email." } });
        }

        const newUser = await USER.create(req.body);

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_KEY,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username
            },
            token
        });
    } catch (error) {
        console.error("Signup Error:", error); 
        res.status(500).json({ message: "Signup failed. Please try again." });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await USER.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email! Please try signing up if you're new." });
        }

        const checkPassword = await encrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_KEY,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed. Please try again." });
    }
};

module.exports = { createUser, loginUser };
