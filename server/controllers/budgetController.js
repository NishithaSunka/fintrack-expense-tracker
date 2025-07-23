// Placeholder for budgetController.js// server/controllers/budgetController.js
const Budget = require('../models/Budget');

// @desc    Get current user's budget
// @route   GET /api/budget
// @access  Private
exports.getBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({ user: req.user.id });
        if (!budget) {
            // If no budget is set, it's not an error, just return 0
            return res.status(200).json({ amount: 0 });
        }
        res.status(200).json(budget);
    } catch (err) {
        res.status(500).json({ error: 'Server error while fetching budget.' });
    }
};

// @desc    Set or update user's budget
// @route   POST /api/budget/set
// @access  Private
exports.setBudget = async (req, res) => {
    const { amount } = req.body;
    try {
        let budget = await Budget.findOne({ user: req.user.id });

        if (budget) {
            // Update existing budget
            budget.amount = amount;
        } else {
            // Create new budget if it doesn't exist
            budget = new Budget({ amount, user: req.user.id });
        }
        
        await budget.save();
        res.status(200).json({ msg: 'Budget updated successfully', budget });

    } catch (err) {
        res.status(500).json({ error: 'Server error while setting budget.' });
    }
};