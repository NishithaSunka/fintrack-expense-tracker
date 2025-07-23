// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './components/Landing'; // <-- 1. Import the new component
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Transactions from './components/Transactions';
import Account from './components/Account';
import Budget from './components/Budget';
import MyGroups from './components/MyGroups';
import CreateGroup from './components/CreateGroup';
import GroupDetails from './components/GroupDetails';
import Sidebar from './components/Sidebar';

// Layout component to conditionally render the sidebar
const Layout = ({ children }) => {
  const location = useLocation();
  // --- 3. Add the root path '/' to the list of pages WITHOUT a sidebar ---
  const noSidebarRoutes = ['/login', '/signup', '/'];

  // The landing page should not have the main app's padding
  const isAuthPage = noSidebarRoutes.includes(location.pathname);

  return (
    <div className={`flex bg-gray-100 min-h-screen ${isAuthPage ? 'p-0' : ''}`}>
      {!isAuthPage && <Sidebar />}
      <main className={`flex-1 ${isAuthPage ? '' : 'p-4 sm:p-6 md:p-10'}`}>
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* --- 2. Change the root path to point to the Landing page --- */}
          <Route path="/" element={<Landing />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/account" element={<Account />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/my-groups" element={<MyGroups />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/groups/:groupId" element={<GroupDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;