// server/models/expense.js
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  amount: {
    type: Number,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    default: 'expense', // Default value for this model
  },
  date: {
    type: Date,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  // The 'user' field links this expense document to a specific user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This refers to the 'User' model
    required: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Expense', ExpenseSchema);