// src/components/Transactions.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import API from '../services/api';

const Transactions = () => {
  const { id } = useParams(); 
  const location = useLocation(); 
  const navigate = useNavigate();
  
  const isEditMode = Boolean(id);
  const existingTransaction = location.state?.transaction;

  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isEditMode && existingTransaction) {
      setType(existingTransaction.type);
      setTitle(existingTransaction.title);
      setAmount(existingTransaction.amount);
      setCategory(existingTransaction.category);
      setDate(new Date(existingTransaction.date).toISOString().split('T')[0]);
    }
  }, [isEditMode, existingTransaction]);

  const incomeCategories = ["Salary", "Investment", "Gift", "Freelance", "Other"];
  const expenseCategories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];


const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
        
        const endpoint = type === 'income' ? '/transactions/add-income' : '/transactions/add-expense';
        
        await API.post(endpoint, { title, amount, date, category });
        setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`);
        
        setTitle('');
        setAmount('');
        setDate('');
        setCategory('');
    } catch (err) {
        const errorMsg = err.response?.data?.msg || 'Failed to add transaction. Please try again.';
        setMessage(errorMsg);
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
            disabled={isEditMode} 
            className={`px-6 py-2 w-1/2 text-lg font-semibold rounded-l-lg transition-colors ${type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'} ${isEditMode && 'cursor-not-allowed opacity-70'}`}
          >
            Income
          </button>
          <button
            onClick={() => setType('expense')}
            disabled={isEditMode} 
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
