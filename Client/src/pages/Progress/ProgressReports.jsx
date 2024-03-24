import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default styling, which you can override
import './ProgressReportsPage.scss'; // Ensure your custom styles are defined here

const ProgressReportsPage = () => {
  const [workoutsByDate, setWorkoutsByDate] = useState({});
  const [recipesByDate, setRecipesByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchSelections = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        const workoutsPromise = axios.get('/api/selections/workouts', config);
        const recipesPromise = axios.get('/api/selections/recipes', config);
        
        const [workoutsResponse, recipesResponse] = await Promise.all([workoutsPromise, recipesPromise]);

        // Assume the response format is directly usable, otherwise you might need to process it to fit your needs
        setWorkoutsByDate(workoutsResponse.data);
        setRecipesByDate(recipesResponse.data);
      } catch (error) {
        console.error('Failed to fetch selections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelections();
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDayClick = (value) => {
    setSelectedDate(value);
    setShowModal(true);
  };

  const renderModalContent = () => {
    const dateKey = formatDate(selectedDate);
    const workoutsForDay = workoutsByDate[dateKey] || [];
    const recipesForDay = recipesByDate[dateKey] || [];
    
    return (
      <>
        <h2>Activities for {dateKey}</h2>
        <h3>Workouts</h3>
        <ul>
          {workoutsForDay.length ? workoutsForDay.map((workout, index) => <li key={index}>{workout.name}</li>) : <li>No workouts found</li>}
        </ul>
        <h3>Recipes</h3>
        <ul>
          {recipesForDay.length ? recipesForDay.map((recipe, index) => <li key={index}>{recipe.title}</li>) : <li>No recipes found</li>}
        </ul>
      </>
    );
  };

  if (loading) return <div className="progress-reports-loading">Loading...</div>;

  return (
    <div className="progress-reports-page">
      <h1>Progress Reports</h1>
      <Calendar
        onClickDay={handleDayClick}
        value={selectedDate}
        className="custom-calendar"
      />
      {showModal && (
        <div className="modal">
          {renderModalContent()}
          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ProgressReportsPage;