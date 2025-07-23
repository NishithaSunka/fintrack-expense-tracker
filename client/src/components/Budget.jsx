// src/components/Budget.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Budget = () => {
    const [budget, setBudget] = useState(0);
    const [newBudget, setNewBudget] = useState('');
    const [spent, setSpent] = useState(0);
    const [message, setMessage] = useState('');
    
    const fetchBudgetData = async () => {
        try {
            const budgetRes = await API.get('/budget');
            setBudget(budgetRes.data.amount || 0);

            const transRes = await API.get('/transactions/all');
            const now = new Date();
            const monthlyExpenses = transRes.data.expense
                .filter(t => {
                    const date = new Date(t.date);
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                })
                .reduce((sum, t) => sum + t.amount, 0);
            
            setSpent(monthlyExpenses);
        } catch (error) {
            console.error("Failed to fetch budget data", error);
            if (error.response && error.response.status === 404) {
              setBudget(0);
            }
        }
    };
    
    useEffect(() => {
        fetchBudgetData();
    }, []);

    const handleSetBudget = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!newBudget || newBudget <= 0) {
            setMessage('Please enter a valid budget amount.');
            return;
        }
        try {
            await API.post('/budget/set', { amount: newBudget });
            setMessage('Budget updated successfully!');
            setBudget(parseFloat(newBudget));
            setNewBudget('');
        } catch (err) {
            setMessage('Failed to update budget.');
            console.error(err);
        }
    };

    const remaining = budget - spent;
    const percentageSpent = budget > 0 ? (spent / budget) * 100 : 0;
    
    let progressColor = 'bg-green-500';
    if (percentageSpent > 75) progressColor = 'bg-yellow-500';
    if (percentageSpent >= 100) progressColor = 'bg-red-500';

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-gray-800">Monthly Budget</h1>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Set Your Monthly Budget</h2>
                <form onSubmit={handleSetBudget} className="flex items-center space-x-4">
                    <input
                        type="number"
                        placeholder="Enter budget amount in ₹"
                        value={newBudget}
                        onChange={(e) => setNewBudget(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button type="submit" className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        Set Budget
                    </button>
                </form>
                {message && <p className="mt-3 text-sm text-center text-green-600">{message}</p>}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">This Month's Progress</h2>
                <div className="space-y-4">
                    <div className="flex justify-between font-medium text-lg">
                        <span>Budget:</span>
                        <span className="text-blue-600">₹{budget.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg">
                        <span>Spent:</span>
                        <span className="text-red-600">₹{spent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl">
                        <span>Remaining:</span>
                        <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>₹{remaining.toFixed(2)}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-6">
                        <div
                            className={`h-6 rounded-full ${progressColor} transition-all duration-500`}
                            style={{ width: `${Math.min(percentageSpent, 100)}%` }}
                        ></div>
                    </div>
                    <div className="text-right font-semibold">{percentageSpent.toFixed(1)}% Spent</div>

                    {percentageSpent >= 100 && (
                      <p className="text-center font-bold text-red-600 text-lg">You've exceeded your budget!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Budget;