const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false   // <-- This makes new todos uncompleted by default
  }
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);
