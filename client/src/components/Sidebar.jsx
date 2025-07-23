// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiTrendingUp, FiPlusSquare, FiUsers, FiLogOut } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa'; // <-- Use Rupee icon from Font Awesome

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const linkClasses = "flex items-center px-4 py-3 text-gray-200 rounded-lg hover:bg-indigo-700 transition-colors";
  const activeLinkClasses = "bg-indigo-700 font-bold";

  return (
    <aside className="w-64 h-screen bg-indigo-900 text-white flex flex-col p-4">
      <div className="text-2xl font-bold mb-10 text-center">
        FinTrack
      </div>
      <nav className="flex flex-col space-y-2">
        <NavLink to="/home" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiHome className="mr-3" /> Dashboard
        </NavLink>
        <NavLink to="/account" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiTrendingUp className="mr-3" /> Account
        </NavLink>
        <NavLink to="/transactions" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiPlusSquare className="mr-3" /> Add Transaction
        </NavLink>
        {/* --- THIS IS THE CHANGED LINE --- */}
        <NavLink to="/budget" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FaRupeeSign className="mr-3" /> Set Budget
        </NavLink>
         <NavLink to="/my-groups" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <FiUsers className="mr-3" /> Groups
        </NavLink>
      </nav>
      <div className="mt-auto">
         <button onClick={handleLogout} className={`${linkClasses} w-full`}>
            <FiLogOut className="mr-3" /> Logout
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;