// server/controllers/transactionController.js
const Income = require('../models/Income');
const Expense = require('../models/Expense');

// Add Income
exports.addIncome = async (req, res) => {
    const { title, amount, category, date } = req.body;
    const income = new Income({ title, amount, category, date, user: req.user.id });
    try {
        if (!title || !category || !date) return res.status(400).json({ msg: "Not all fields have been entered." });
        if (amount <= 0 || isNaN(amount)) return res.status(400).json({ msg: "Amount must be a positive number." });
        await income.save();
        res.json({ msg: "Income successfully added", income });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Incomes
exports.getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(incomes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Income
exports.deleteIncome = async (req, res) => {
    try {
        const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!income) return res.status(404).json({ msg: "No income found with this ID." });
        res.json({ msg: "Income deleted." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add Expense
exports.addExpense = async (req, res) => {
    const { title, amount, category, date } = req.body;
    const expense = new Expense({ title, amount, category, date, user: req.user.id });
    try {
        if (!title || !category || !date) return res.status(400).json({ msg: "Not all fields have been entered." });
        if (amount <= 0 || isNaN(amount)) return res.status(400).json({ msg: "Amount must be a positive number." });
        await expense.save();
        res.json({ msg: "Expense successfully added", expense });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Expenses
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!expense) return res.status(404).json({ msg: "No expense found." });
        res.json({ msg: "Expense deleted." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- THIS IS THE NEW, FULLY WORKING UPDATE FUNCTION ---
// @desc    Update a transaction
// @route   PUT /api/transactions/update/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { title, amount, category, date, type } = req.body;

    // Add robust validation
    if (!title || !amount || !category || !date) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
    }
    if (amount <= 0 || isNaN(amount)) {
        return res.status(400).json({ error: 'Please provide a valid, positive amount.' });
    }

    try {
        const Model = type === 'income' ? Income : Expense;
        const transaction = await Model.findOne({ _id: id, user: req.user.id });

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found or user not authorized.' });
        }

        transaction.title = title;
        transaction.amount = amount;
        transaction.category = category;
        transaction.date = date;

        await transaction.save();
        res.status(200).json({ success: true, data: transaction });
    } catch (err) {
        console.error("Error in updateTransaction:", err);
        res.status(500).json({ error: 'Server error while updating transaction.' });
    }
};

// Get All transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const income = await Income.find({ user: req.user.id });
        const expense = await Expense.find({ user: req.user.id });
        res.status(200).json({ income, expense });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching transactions" });
    }
};