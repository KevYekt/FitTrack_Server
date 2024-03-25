// RegisterForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './registerForm.scss';

const RegisterForm = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/users/register`, formData);
      localStorage.setItem('token', response.data.token); // Store the token
      navigate('/profile'); // Navigate to profile page
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again later.');
    }
  };

  return (
    <div className="register-form-container">
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleRegister} className="register-form">
      <div className="register-form-title">Register</div> 
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;