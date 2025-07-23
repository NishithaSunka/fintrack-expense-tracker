// server/controllers/groupController.js
const Group = require('../models/Group');
const User = require('../models/User');
const GroupExpense = require('../models/GroupExpense');

// @desc    Create a new group
// @route   POST /api/groups/create
// @access  Private
exports.createGroup = async (req, res) => {
    const { groupName, memberEmails } = req.body;

    try {
        // Find users by their emails
        const users = await User.find({ email: { $in: memberEmails } });
        const memberIds = users.map(user => user._id);

        // Ensure the creator is always a member
        if (!memberIds.some(id => id.equals(req.user.id))) {
            memberIds.push(req.user.id);
        }

        const group = new Group({
            groupName,
            createdBy: req.user.id,
            members: memberIds,
        });

        await group.save();
        res.status(201).json({ msg: "Group created successfully", group });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get all groups for the current user
// @route   GET /api/groups/my-groups
// @access  Private
exports.getMyGroups = async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user.id })
            .populate('members', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(groups);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch groups.' });
    }
};

// @desc    Add an expense to a group
// @route   POST /api/groups/add-expense
// @access  Private
exports.addExpenseToGroup = async (req, res) => {
    const { groupId, title, amount } = req.body;
    try {
        const expense = new GroupExpense({
            groupId,
            title,
            amount,
            paidBy: req.user.id,
        });
        await expense.save();
        res.status(201).json({ msg: 'Expense added to group', expense });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add expense.' });
    }
};

// @desc    Get a summary of a group's expenses and balances
// @route   GET /api/groups/:groupId/summary
// @access  Private
exports.getGroupSummary = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId).populate('members', 'name email');
        if (!group) return res.status(404).json({ msg: 'Group not found.' });

        const expenses = await GroupExpense.find({ groupId }).populate('paidBy', 'name');

        // Calculate balances
        const balances = {};
        group.members.forEach(member => {
            balances[member.id] = { name: member.name, balance: 0 };
        });

        expenses.forEach(exp => {
            // Add to the payer's balance
            if (balances[exp.paidBy.id]) {
                balances[exp.paidBy.id].balance += exp.amount;
            }

            // Subtract from everyone's balance (equal split)
            const share = exp.amount / group.members.length;
            group.members.forEach(member => {
                if (balances[member.id]) {
                    balances[member.id].balance -= share;
                }
            });
        });

        // Simplified settlement logic
        const { debtors, creditors } = Object.values(balances).reduce((acc, user) => {
            if (user.balance < 0) acc.debtors.push({ name: user.name, amount: -user.balance });
            if (user.balance > 0) acc.creditors.push({ name: user.name, amount: user.balance });
            return acc;
        }, { debtors: [], creditors: [] });

        const owes = [];
        let i = 0, j = 0;
        while (i < debtors.length && j < creditors.length) {
            const debt = debtors[i];
            const credit = creditors[j];
            const amount = Math.min(debt.amount, credit.amount);

            owes.push({ from: debt.name, to: credit.name, amount });

            debt.amount -= amount;
            credit.amount -= amount;

            if (debt.amount < 0.01) i++;
            if (credit.amount < 0.01) j++;
        }

        res.status(200).json({ group, expenses, owes });

    } catch (err) {
        res.status(500).json({ error: 'Server error fetching group summary.' });
    }
};