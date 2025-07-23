// src/components/Transactions.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import API from '../services/api';

const Transactions = () => {
  const { id } = useParams(); // Get the ID from the URL, if it exists
  const location = useLocation(); // Get the state passed from the navigation
  const navigate = useNavigate();
  
  const isEditMode = Boolean(id);
  const existingTransaction = location.state?.transaction;

  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  // Pre-fill the form if in edit mode
  useEffect(() => {
    if (isEditMode && existingTransaction) {
      setType(existingTransaction.type);
      setTitle(existingTransaction.title);
      setAmount(existingTransaction.amount);
      setCategory(existingTransaction.category);
      // Format the date correctly for the input[type="date"] field (YYYY-MM-DD)
      setDate(new Date(existingTransaction.date).toISOString().split('T')[0]);
    }
  }, [isEditMode, existingTransaction]);

  const incomeCategories = ["Salary", "Investment", "Gift", "Freelance", "Other"];
  const expenseCategories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const transactionData = { title, amount, date, category, type };

    try {
      if (isEditMode) {
        // --- EDIT LOGIC ---
        await API.put(`/transactions/edit-transaction/${id}`, transactionData);
        setMessage('Transaction updated successfully!');
      } else {
        // --- ADD LOGIC ---
        await API.post('/transactions/add-transaction', transactionData);
        setMessage('Transaction added successfully!');
        // Reset form only when adding a new one
        setTitle('');
        setAmount('');
        setDate('');
        setCategory('');
      }

      // Redirect back to the dashboard after a short delay
      setTimeout(() => navigate('/home'), 1500);

    } catch (err) {
      setMessage('Operation failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        {isEditMode ? 'Edit Transaction' : 'Add a New Transaction'}
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setType('income')}
            disabled={isEditMode} // Disable type switching when editing
            className={`px-6 py-2 w-1/2 text-lg font-semibold rounded-l-lg transition-colors ${type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'} ${isEditMode && 'cursor-not-allowed opacity-70'}`}
          >
            Income
          </button>
          <button
            onClick={() => setType('expense')}
            disabled={isEditMode} // Disable type switching when editing
            className={`px-6 py-2 w-1/2 text-lg font-semibold rounded-r-lg transition-colors ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} ${isEditMode && 'cursor-not-allowed opacity-70'}`}
          >
            Expense
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Category</option>
            {(type === 'income' ? incomeCategories : expenseCategories).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full py-3 text-lg font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {isEditMode ? 'Save Changes' : 'Add Transaction'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default Transactions;