// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import './profile.scss';


const ProfilePage = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

  const [profileData, setProfileData] = useState({
    age: '',
    weight: '',
    fitnessGoals: '',
    dietaryPreferences: '',
    goalWeight: '', 

  });
  const [error, setError] = useState('');
  const bodyParts = [
    'back', 'cardio', 'chest', 'lower arms', 'lower legs',
    'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'
  ];

  // Function to fetch profile data
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/users/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProfileData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching profile data.');
    }
  };

  useEffect(() => {
    // Get token from localStorage and decode it to retrieve userId
    const token = localStorage.getItem('token');
    if (token) {
        const decoded = jwtDecode(token); // Use jwtDecode here
        const userId = decoded.userId;
      fetchProfile(userId);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.userId;
      const currentDate = new Date().toISOString().split('T')[0];

      const updatedProfileData = {
        ...profileData,
        dietaryPreferences: JSON.stringify(profileData.dietaryPreferences),
        updateDate: currentDate
      };
      
  

      try {
        await axios.put(`${BASE_URL}api/users/profile/${userId}`, updatedProfileData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Profile updated successfully!');
      } catch (error) {
        setError('Failed to update profile. Please try again.');
      }
    } else {
      setError('No authentication token found. Please log in.');
    }
  };

  return (
    <div className="profile-page-container">
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            name="age"
            id="age"
            value={profileData.age || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="weight">Weight:</label>
          <input
            type="number"
            name="weight"
            id="weight"
            value={profileData.weight || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="goalWeight">Goal Weight:</label>
          <input
            type="number"
            name="goalWeight"
            id="goalWeight"
            value={profileData.goalWeight || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
        <label htmlFor="fitnessGoals">Fitness Goals:</label>
        <select
          name="fitnessGoals"
          id="fitnessGoals"
          value={profileData.fitnessGoals}
          onChange={handleInputChange}
          required
        >
          {bodyParts.map(part => (
            <option key={part} value={part}>{part}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
  <label htmlFor="dietaryPreferences">Dietary Preferences:</label>
  <select
    name="dietaryPreferences"
    id="dietaryPreferences"
    value={profileData.dietaryPreferences}
    onChange={handleInputChange}
    required
  >
    <option value="high protein">High Protein</option>
    <option value="high calories">High Calories</option>
    <option value="low calories">Low Calories</option>
    <option value="high fat">High Fat</option>
    <option value="low carbs">Low Carbs</option>
    <option value="high carbs">High Carbs</option>
  </select>
</div>
        <button type="submit" className="profile-submit-button">Update Profile</button>
      </form>
      <div className="link-section">
        <Link to="/workouts" className="navigation-link">Go to Workout Plan</Link>
        <p className="link-description">Explore tailored workout plans to fit your fitness goals.</p>
      </div>
      <div className="link-section">
        <Link to="/nutrition-logs" className="navigation-link">View Nutrition Logs</Link>
        <p className="link-description">Keep track of your diet and nutritional intake.</p>
      </div>
      <div className="link-section">
        <Link to="/progress-reports" className="navigation-link">View Progress Reports</Link>
        <p className="link-description">Review your fitness and nutrition progress over time.</p>
      </div>
    </div>
  );
};

export default ProfilePage;