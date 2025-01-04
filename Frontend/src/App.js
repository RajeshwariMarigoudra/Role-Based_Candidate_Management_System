import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import { getProfile } from './utils/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import Report from './components/Report';

const App = () => {
  const [user, setUser] = useState(null);
  // Fetch user data based on token when app is loaded
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getProfile(token)
        .then((data) => {
          console.log('User data fetched:', data);
          setUser(data); // Make sure the user state is set after fetching profile data
        })
        .catch((err) => console.log('Error fetching profile:', err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null); // Reset the user state on logout
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        {/* Redirect to /profile if the user is already logged in */}
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/profile" />}
        />

        {/* Admin can access the dashboard, else redirect to /profile */}
        <Route
          path="/dashboard"
          element={user?.role === 'admin' ? <Dashboard user={user} /> : <Navigate to="/profile" />}
        />

        {/* Profile route is accessible if user is logged in */}
        <Route
          path="/profile"
          element={user ? <UserProfile /> : <Navigate to="/" />}
        />

        {/* Report route is accessible if user is logged in */}
        <Route
          path="/report"
          element={user ? <Report /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
