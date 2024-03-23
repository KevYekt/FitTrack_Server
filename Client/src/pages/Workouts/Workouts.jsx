import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './workouts.scss'; 

const WorkoutPage = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // Function to fetch exercises based on the user's fitness goals
    const fetchExercises = async () => {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
      try {
       const response = await axios.get('http://localhost:3000/api/workouts/exercises/goal', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
        setExercises(response.data); // Assuming the response contains an array of exercises
      } catch (error) {
        console.error('Error fetching exercises:', error.response?.data?.message || 'An unknown error occurred');
      }
    };

    fetchExercises();
  }, []);

  return (
    <div className="workout-page">
      <h1>Your Personalized Workout Plan</h1>
      {exercises.length === 0 ? (
        <p>No exercises found. Try updating your goals in your profile.</p>
      ) : (
        <ul className="exercise-list">
          {exercises.map((exercise, index) => (
            <li key={index} className="exercise-item">
              <div className="exercise-details">
                <h2>{exercise.name}</h2>
                <img src={exercise.gifUrl} alt={exercise.name} />
                <p>Body Part: {exercise.bodyPart}</p>
                <p>Equipment: {exercise.equipment}</p>
                <p>Instructions: <span dangerouslySetInnerHTML={{ __html: exercise.instructions }} /></p> {/* Instructions might contain HTML depending on how they are provided */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkoutPage;
