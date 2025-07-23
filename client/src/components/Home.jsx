// client/src/components/Home.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react'; // <-- THE FIX IS HERE
import API from '../services/api';
import {
    FiPlusCircle, FiArrowUpCircle, FiArrowDownCircle, FiSearch,
    FiEdit, FiTrash2, FiX
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Home = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [typeFilter, setTypeFilter] = useState('All');
    const [timeFilter, setTimeFilter] = useState('All Time');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const res = await API.get('/transactions/all');
            const allTransactions = [
                ...res.data.income.map(t => ({ ...t, type: 'income' })),
                ...res.data.expense.map(t => ({ ...t, type: 'expense' })),
            ];
            allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            setTransactions(allTransactions);
        } catch (err) {
            console.error("Failed to load transactions", err);
            if (err.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (id, type) => {
        const endpoint = type === 'income' ? `/transactions/delete-income/${id}` : `/transactions/delete-expense/${id}`;
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            setTransactions(currentTransactions => currentTransactions.filter(t => t._id !== id));
            try {
                await API.delete(endpoint);
            } catch (err) {
                alert("Could not delete the transaction. Restoring list.");
                fetchData();
            }
        }
    };

    const openEditModal = (transaction) => {
        setEditingTransaction({ ...transaction, date: new Date(transaction.date).toISOString().split('T')[0] });
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const handleUpdate = async (updatedTransaction) => {
        try {
            await API.put(`/transactions/update/${updatedTransaction._id}`, updatedTransaction);
            closeEditModal();
            fetchData();
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Error updating transaction.";
            alert(errorMsg);
        }
    };

    const filteredTransactions = useMemo(() => {
        const safeTransactions = Array.isArray(transactions) ? transactions : [];
        return safeTransactions.filter(t => {
            const typeMatch = typeFilter === 'All' || t.type === typeFilter;
            const timeMatch = (() => {
                if (timeFilter === 'All Time') return true;
                const now = new Date();
                const transactionDate = new Date(t.date);
                switch (timeFilter) {
                    case 'This Week':
                        const startOfWeek = new Date(now);
                        startOfWeek.setDate(now.getDate() - now.getDay());
                        startOfWeek.setHours(0, 0, 0, 0);
                        return transactionDate >= startOfWeek;
                    case 'This Month':
                        return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
                    case 'This Year':
                        return transactionDate.getFullYear() === now.getFullYear();
                    default: return true;
                }
            })();
            const searchMatch = !searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase());
            return typeMatch && timeMatch && searchMatch;
        });
    }, [transactions, typeFilter, timeFilter, searchTerm]);

    const chartData = useMemo(() => {
        const safeTransactions = Array.isArray(transactions) ? transactions : [];
        if (typeFilter === 'All' || safeTransactions.length === 0) return null;
        const relevantData = safeTransactions.filter(t => t.type === typeFilter).slice(0, 7).reverse();
        return {
            labels: relevantData.map(t => new Date(t.date).toLocaleDateString()),
            datasets: [{
                label: `Last 7 ${typeFilter}s`,
                data: relevantData.map(t => t.amount),
                backgroundColor: typeFilter === 'income' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)',
                borderColor: typeFilter === 'income' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
                tension: 0.2,
                fill: true,
            }]
        };
    }, [transactions, typeFilter]);

    if (loading) return <div className="text-center text-lg">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <button onClick={() => navigate('/transactions')} className="flex items-center px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 w-full sm:w-auto">
                    <FiPlusCircle className="mr-2" /> Add Transaction
                </button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4 items-center">
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full md:w-1/4 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500">
                    <option value="All">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="w-full md:w-1/4 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500">
                    <option value="All Time">All Time</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                    <option value="This Year">This Year</option>
                </select>
                <div className="relative w-full md:w-1/2">
                    <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-indigo-500" />
                </div>
            </div>
            {typeFilter !== 'All' && chartData && (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Last 7 {typeFilter}s</h2>
                    {typeFilter === 'income' ? <Line data={chartData} /> : <Bar data={chartData} />}
                </div>
            )}
            <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-700">Transactions</h2>
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((t) => (
                        <TransactionCard key={t._id} transaction={t} onDelete={handleDelete} onEdit={openEditModal} />
                    ))
                ) : (
                    <div className="bg-white p-6 rounded-lg text-center text-gray-500">No matching transactions found.</div>
                )}
            </div>
            {isModalOpen && editingTransaction && (
                <EditModal transaction={editingTransaction} onClose={closeEditModal} onUpdate={handleUpdate} />
            )}
        </div>
    );
};

const TransactionCard = ({ transaction, onDelete, onEdit }) => {
    const isIncome = transaction.type === 'income';
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between group hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
                    {isIncome ? <FiArrowUpCircle className="text-green-600" /> : <FiArrowDownCircle className="text-red-600" />}
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">{transaction.title}</h3>
                    <p className="text-sm text-gray-500">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <p className={`font-bold text-lg ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </p>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(transaction)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><FiEdit /></button>
                    <button onClick={() => onDelete(transaction._id, transaction.type)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><FiTrash2 /></button>
                </div>
            </div>
        </div>
    );
};

const EditModal = ({ transaction, onClose, onUpdate }) => {
    const [formState, setFormState] = useState(transaction);
    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formState);
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Edit Transaction</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><FiX size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" value={formState.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                    <input type="number" name="amount" value={formState.amount} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                    <input type="date" name="date" value={formState.date} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                    <select name="category" value={formState.category} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md">
                        {/* A simple implementation for categories */}
                        <option value={formState.category}>{formState.category}</option>
                        {["Salary", "Investment", "Gift", "Freelance", "Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"]
                            .filter(cat => cat !== formState.category)
                            .map(cat => <option key={cat} value={cat}>{cat}</option>)
                        }
                    </select>
                    <button type="submit" className="w-full py-3 mt-4 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Home;