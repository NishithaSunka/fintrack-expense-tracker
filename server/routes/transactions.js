
const express = require('express');
const {
    addIncome, getIncomes, deleteIncome,
    addExpense, getExpenses, deleteExpense,
    getAllTransactions,
    updateTransaction 
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.post('/add-income', addIncome);
router.get('/get-incomes', getIncomes);
router.delete('/delete-income/:id', deleteIncome);
router.post('/add-expense', addExpense);
router.get('/get-expenses', getExpenses);
router.delete('/delete-expense/:id', deleteExpense);
router.get('/all', getAllTransactions);
router.put('/update/:id', updateTransaction);

module.exports = router;