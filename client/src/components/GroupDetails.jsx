// src/components/GroupDetails.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { FiUser, FiFileText, FiPlus, FiRepeat, FiUploadCloud, FiX, FiEdit } from 'react-icons/fi';
import Tesseract from 'tesseract.js';

const GroupDetails = () => {
    // ... (All state and functions from the previous version remain exactly the same) ...
    // No changes are needed to the JavaScript logic.
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [expenseTitle, setExpenseTitle] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);

    const fetchGroupDetails = useCallback(async () => {
        try {
            const res = await API.get(`/groups/${groupId}/summary`);
            setGroup(res.data);
        } catch (err) {
            console.error('Failed to fetch group details', err);
            setError('Could not load group details. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchGroupDetails();
    }, [fetchGroupDetails]);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!expenseTitle || !expenseAmount) {
            alert("Please fill in both title and amount.");
            return;
        }
        try {
            await API.post('/groups/add-expense', {
                groupId,
                title: expenseTitle,
                amount: expenseAmount,
            });
            setExpenseTitle('');
            setExpenseAmount('');
            fetchGroupDetails();
        } catch (err) {
            console.error('Failed to add expense', err);
            alert('Error adding expense.');
        }
    };

    const handleAnalyzeBill = async () => {
        if (!selectedFile) return;
        setIsAnalyzing(true);
        setOcrProgress(0);

        const { data: { text } } = await Tesseract.recognize(
            selectedFile,
            'eng',
            { logger: m => { if (m.status === 'recognizing text') setOcrProgress(parseInt(m.progress * 100)) } }
        );

        setIsAnalyzing(false);

        const findTotalAmount = (ocrText) => {
            const lines = ocrText.split('\n');
            let potentialTotals = [];
            const keywords = ['total', 'amount', 'subtotal', 'due', 'balance', 'grand total'];
            const numberRegex = /([\d,]+\.\d{2})/g;
            const parseNumber = (numStr) => parseFloat(numStr.replace(/,/g, ''));
            lines.forEach(line => {
                if (keywords.some(kw => line.toLowerCase().includes(kw))) {
                    const numbers = line.match(numberRegex);
                    if (numbers) potentialTotals.push(...numbers.map(parseNumber));
                }
            });
            if (potentialTotals.length > 0) return Math.max(...potentialTotals);
            const allNumbers = ocrText.match(numberRegex);
            if (allNumbers) return Math.max(...allNumbers.map(parseNumber));
            return 0;
        };

        const detectedAmount = findTotalAmount(text);
        
        if (detectedAmount > 0) {
            setExpenseAmount(detectedAmount.toFixed(2));
            setExpenseTitle(selectedFile.name.split('.').slice(0, -1).join('.'));
            closeModalAndReset();
            alert(`Amount Detected: ₹${detectedAmount.toFixed(2)}. Please confirm the details below and save.`);
        } else {
            alert("Could not detect a total amount. Please enter it manually.");
            closeModalAndReset();
        }
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const closeModalAndReset = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setPreview(null);
        setOcrProgress(0);
    };

    if (loading) return <p>Loading group details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!group) return <p>Group not found.</p>;

    // --- The JSX is the only part that changes from here ---
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-gray-800">{group.group.groupName}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* --- START: Left Column (Redesigned) --- */}
                <div className="md:col-span-1 space-y-8">
                    
                    {/* Members List Card (No change) */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center"><FiUser className="mr-2"/>Members</h2>
                        <ul className="space-y-2">
                            {group.group.members.map(member => (
                                <li key={member._id} className="text-gray-700">{member.name}</li>
                            ))}
                        </ul>
                    </div>

                    {/* NEW: Smart Add Card */}
                    <div className="bg-white p-6 rounded-lg shadow text-center border-2 border-dashed border-indigo-400">
                        <h2 className="text-2xl font-semibold mb-2 flex items-center justify-center">
                           <FiUploadCloud className="mr-2"/>Smart Add
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">Let AI read the bill for you.</p>
                        <button 
                           onClick={() => setIsModalOpen(true)} 
                           className="w-full flex items-center justify-center py-3 px-4 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
                        >
                           Upload & Analyze Bill
                        </button>
                    </div>

                    {/* UPDATED: Manual Add Expense Card */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-semibold flex items-center mb-2">
                           <FiEdit className="mr-2"/>Manual Add
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">Enter the expense details yourself.</p>
                        <form onSubmit={handleAddExpense} className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Expense Title" 
                                value={expenseTitle} 
                                onChange={(e) => setExpenseTitle(e.target.value)} 
                                required 
                                className="w-full px-4 py-2 border rounded-md"
                            />
                            <input 
                                type="number" 
                                placeholder="Amount (₹)" 
                                value={expenseAmount} 
                                onChange={(e) => setExpenseAmount(e.target.value)} 
                                required 
                                className="w-full px-4 py-2 border rounded-md"
                            />
                            <button 
                                type="submit" 
                                className="w-full py-2 font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-800"
                            >
                                Save Manual Expense
                            </button>
                        </form>
                    </div>
                </div>
                {/* --- END: Left Column --- */}

                {/* --- START: Right Column (No change) --- */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center"><FiRepeat className="mr-2"/>Balances</h2>
                        {group.owes.length > 0 ? (
                            <ul className="space-y-3">
                                {group.owes.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center text-lg">
                                        <span><span className="font-bold text-red-500">{item.from}</span> owes <span className="font-bold text-green-500">{item.to}</span></span>
                                        <span className="font-bold">₹{parseFloat(item.amount).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : ( <p className="text-gray-500">Everyone is settled up!</p> )}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center"><FiFileText className="mr-2"/>Group Expenses</h2>
                        <ul className="space-y-4">
                            {group.expenses.length > 0 ? group.expenses.map(exp => (
                                <li key={exp._id} className="border-b pb-2">
                                    <div className="flex justify-between font-bold">
                                        <span>{exp.title}</span>
                                        <span className="font-bold">₹{exp.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">Paid by {exp.paidBy.name}</div>
                                </li>
                            )) : <p className="text-gray-500">No expenses recorded for this group yet.</p>}
                        </ul>
                    </div>
                </div>
                {/* --- END: Right Column --- */}
            </div>

            {/* Bill Analysis Modal (No change) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Upload Bill</h2>
                            <button onClick={closeModalAndReset} className="text-gray-500 hover:text-gray-800"><FiX size={24}/></button>
                        </div>
                        <div className="space-y-4">
                           <p className="text-sm text-gray-600">The bill will be analyzed in your browser. This may be slow the first time.</p>
                           <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                           {preview && <img src={preview} alt="Bill preview" className="mt-4 max-h-60 rounded-md mx-auto"/>}
                           {isAnalyzing && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${ocrProgress}%` }}></div>
                                </div>
                           )}
                           <button onClick={handleAnalyzeBill} disabled={!selectedFile || isAnalyzing} className="w-full py-3 mt-4 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                                {isAnalyzing ? `Analyzing... ${ocrProgress}%` : 'Analyze Image'}
                           </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupDetails;