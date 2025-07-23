// client/src/components/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaRupeeSign } from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-500 text-white">
      <div className="text-center p-8 max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-full shadow-lg">
            <FaRupeeSign className="text-7xl text-indigo-600" />
          </div>
        </div>
        <h1 className="text-5xl md:text-5xl font-extrabold mb-4 animate-fade-in-down">
          Welcome to FinTrack
        </h1>

        <p className="text-xl md:text-1xl text-indigo-200 mb-10 animate-fade-in-up">
          Your personal finance, simplified and clarified.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-3 text-lg font-semibold bg-white text-indigo-600 rounded-lg shadow-md hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3 text-lg font-semibold bg-indigo-500/50 border-2 border-indigo-300 text-white rounded-lg shadow-md hover:bg-indigo-500/80 transform hover:scale-105 transition-all duration-300"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Landing;