import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginForm.scss';
import axios from 'axios';


const LoginForm = ({ onLoginSuccess }) => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}api/users/login`, {
        email,
        password,
      });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Optionally update app state or context to reflect authentication status
        if (onLoginSuccess) {
          onLoginSuccess(); // Call the onLoginSuccess function if it's passed as a prop
        }
        navigate('/profile'); // Redirect user to their profile page
      } else {
        // Handle case where login was successful but no token was received
        console.error('Login successful but no token received.');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : 'An unknown error occurred');
      // Optionally, update the UI to inform the user that login failed
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleLogin} className="login-form">
      <div className="login-form-title">Login</div> 
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;