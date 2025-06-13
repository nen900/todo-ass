

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    task: String,
    status: {
    type: String,
    enum: ['pending', 'complete', 'deleted'],
    default: 'pending',
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
  },
}, {timestamps: true } );

const TODOS = new mongoose.model("TASK", taskSchema);
module.exports = TODOS;