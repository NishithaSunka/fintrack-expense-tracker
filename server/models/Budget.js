
const mongoose = require('mongoose');
const BudgetSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, 
  },
});
module.exports = mongoose.model('Budget', BudgetSchema);