import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.scss';
import brandIcon from '../../assets/logo.jpg'; // Path to your brand icon

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={brandIcon} alt="FitTrack logo" className="navbar-brand-icon" />
        FitTrack
      </Link>
      <div className="navbar-links">
        {isAuthenticated && <Link to="/profile" className="navbar-link">Profile</Link>}
        {isAuthenticated ? (
          <button onClick={handleLogout} className="navbar-link">Logout</button>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;