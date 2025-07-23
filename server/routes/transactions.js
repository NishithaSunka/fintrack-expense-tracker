// server/routes/transactions.js
const express = require('express');
const {
    addIncome, getIncomes, deleteIncome,
    addExpense, getExpenses, deleteExpense,
    getAllTransactions,
    updateTransaction // Make sure this is imported
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

// Routes for incomes
router.post('/add-income', addIncome);
router.get('/get-incomes', getIncomes);
router.delete('/delete-income/:id', deleteIncome);

// Routes for expenses
router.post('/add-expense', addExpense);
router.get('/get-expenses', getExpenses);
router.delete('/delete-expense/:id', deleteExpense);

// Route to get all transactions for the user
router.get('/all', getAllTransactions);

// --- THIS IS THE NEW, CORRECT ROUTE FOR UPDATING ---
router.put('/update/:id', updateTransaction);

module.exports = router;