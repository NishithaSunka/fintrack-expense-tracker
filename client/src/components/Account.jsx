import React, { useState, useEffect, useMemo } from 'react';
import API from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import { FaRupeeSign } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Account = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('All Time');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/transactions/all');
        
        if (res && res.data && Array.isArray(res.data.income) && Array.isArray(res.data.expense)) {
          const allTransactions = [
            ...res.data.income.map(t => ({ ...t, type: 'income' })),
            ...res.data.expense.map(t => ({ ...t, type: 'expense' })),
          ];
          setTransactions(allTransactions);
        } else {
          console.error("API returned unexpected data structure:", res.data);
          setTransactions([]);
        }
      } catch (err) {
        console.error('Failed to fetch account data', err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    const now = new Date();
    if (filter === 'All Time') return transactions;
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      switch (filter) {
        case 'This Week':
          const today = new Date();
          const firstDayOfWeek = today.getDate() - today.getDay();
          const startOfWeek = new Date(today.setDate(firstDayOfWeek));
          startOfWeek.setHours(0, 0, 0, 0);
          return transactionDate >= startOfWeek;
        case 'This Month':
          return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
        case 'This Year':
          return transactionDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [transactions, filter]);

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netTotal = totalIncome - totalExpense;

  const chartData = {
    labels: ['Income', 'Expense'],
    datasets: [ { label: 'Amount (₹)', data: [totalIncome, totalExpense], backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'], borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'], borderWidth: 1, }, ],
  };

  if (loading) return <p className="text-center text-lg">Loading account summary...</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-bold text-gray-800">Account Summary</h1>
        <div className="w-full sm:w-auto">
           <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full sm:w-48 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
             <option value="All Time">All Time</option>
             <option value="This Week">This Week</option>
             <option value="This Month">This Month</option>
             <option value="This Year">This Year</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-100 p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-green-800">Total Income</h3>
          <p className="text-3xl font-bold text-green-600 flex items-center justify-center">
            <FaRupeeSign className="mr-2"/>{totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-red-100 p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-red-800">Total Expense</h3>
          <p className="text-3xl font-bold text-red-600 flex items-center justify-center">
            <FaRupeeSign className="mr-2"/>{totalExpense.toFixed(2)}
          </p>
        </div>
        <div className={`p-6 rounded-lg shadow text-center ${netTotal >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
            <h3 className={`text-lg font-semibold ${netTotal >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>Net Balance</h3>
            <p className={`text-3xl font-bold flex items-center justify-center ${netTotal >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>
                <FaRupeeSign className="mr-2"/>{netTotal.toFixed(2)}
            </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-center">Income vs. Expense (Bar)</h3>
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-center">Income vs. Expense (Pie)</h3>
          <Pie data={chartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Account;
