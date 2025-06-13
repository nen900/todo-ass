

const dotenv = require("dotenv")
dotenv.config();

const port = 8000;

const db = process.env.mongodb_url;
const express = require("express");
const app = express();
const authRouthes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const cors = require("cors");
const TODOS = require("./models/todoSchema.js");
const authenticateusr = require("./middleware/authMiddleware");

const mongoose = require("mongoose");

app.use(express.json());
app.use(cors());

mongoose.connect(db, {})
    .then(() => {
        console.log("mongodb connected succesly");
        app.listen(port, () => {
            console.log(`server isat ${port}`);
});
    }).catch((err) => {
        console.log("failed to connect mongodb", err);
    })


//n.n this should be general homepage beforelogin or siguo so its own route file    


//n.b this should be the like homepage when worked login like when user logs in
app.get("/get", authenticateusr, async (req, res) => {
  try {
    const tasks = await TODOS.find({ user: req.user._id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

app.use(authRouthes);  
app.use(taskRoutes);  
