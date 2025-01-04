import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate(); // Use the useNavigate hook for navigation

  const handleLogout = () => {
    // Call the onLogout function passed via props (to clear the user state in App)
    onLogout();
    navigate('/'); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">App</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                {/* Show Dashboard link for admins */}
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                  </li>
                )}
                {/* Show Profile link */}
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                {/* Logout button */}
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                {/* Show Login link for unauthenticated users */}
                <li className="nav-item">
                  <Link className="nav-link" to="/">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
