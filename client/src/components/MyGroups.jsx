// src/components/MyGroups.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FiUsers, FiPlus } from 'react-icons/fi';

const MyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await API.get('/groups/my-groups');
        setGroups(res.data);
      } catch (err) {
        console.error("Failed to fetch groups", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  if (loading) {
    return <p>Loading your groups...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">My Groups</h1>
        <button
          onClick={() => navigate('/create-group')}
          className="flex items-center px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700"
        >
          <FiPlus className="mr-2" /> Create Group
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {groups.length > 0 ? (
          <div className="space-y-4">
            {groups.map((group) => (
              <div
                key={group._id}
                onClick={() => navigate(`/groups/${group._id}`)}
                className="flex items-center p-4 border rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <FiUsers className="w-6 h-6 mr-4 text-indigo-500" />
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{group.groupName}</h3>
                  <p className="text-sm text-gray-600">{group.members.length} members</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">You are not part of any groups yet. Why not create one?</p>
        )}
      </div>
    </div>
  );
};

export default MyGroups;