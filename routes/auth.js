

const {Router} = require("express");
const {createUser, loginUser} = require("../controllers/authController");
const router = Router();
const authenticateusr = require("../middleware/authMiddleware");


router.post("/signup", createUser);
router.post("/login", loginUser);


module.exports = router