
const Budget = require('../models/Budget');


exports.getBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({ user: req.user.id });
        if (!budget) {
            return res.status(200).json({ amount: 0 });
        }
        res.status(200).json(budget);
    } catch (err) {
        res.status(500).json({ error: 'Server error while fetching budget.' });
    }
};
exports.setBudget = async (req, res) => {
    const { amount } = req.body;
    try {
        let budget = await Budget.findOne({ user: req.user.id });
        if (budget) {
            budget.amount = amount;
        } else {
            budget = new Budget({ amount, user: req.user.id });
        }
        await budget.save();
        res.status(200).json({ msg: 'Budget updated successfully', budget });
    } catch (err) {
        res.status(500).json({ error: 'Server error while setting budget.' });
    }
};