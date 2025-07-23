// src/components/CreateGroup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [memberEmails, setMemberEmails] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const emails = memberEmails.split(',').map(email => email.trim()).filter(Boolean);

    try {
      await API.post('/groups/create', { groupName, memberEmails: emails });
      setMessage('Group created successfully! Redirecting...');
      setTimeout(() => navigate('/my-groups'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create group.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Create a New Group</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="groupName" className="text-sm font-medium text-gray-700">
              Group Name
            </label>
            <input
              id="groupName"
              type="text"
              placeholder="e.g., Trip to Mountains"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="memberEmails" className="text-sm font-medium text-gray-700">
              Member Emails
            </label>
            <textarea
              id="memberEmails"
              placeholder="Enter emails, separated by commas"
              value={memberEmails}
              onChange={(e) => setMemberEmails(e.target.value)}
              rows="3"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Your own email will be added automatically.</p>
          </div>
          <button
            type="submit"
            className="w-full py-3 text-lg font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create Group
          </button>
        </form>
        {error && <p className="mt-4 text-center text-sm font-medium text-red-600">{error}</p>}
        {message && <p className="mt-4 text-center text-sm font-medium text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default CreateGroup;