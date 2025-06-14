const USER = require("../models/userShema");
const jwt = require("jsonwebtoken");
const judge = require("validator");


const createUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!judge.isEmail(email)) {
            return res.status(400).json({ message: " not a valid email, please recheck" });
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
        res.status(500).json({ message: "Signup failed. Please try again." });
    }
};
