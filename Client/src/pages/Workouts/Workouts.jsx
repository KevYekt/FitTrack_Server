import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './workouts.scss';

const WorkoutPage = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState(new Set());

  useEffect(() => {
    const fetchExercises = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      try {
        const response = await axios.get('http://localhost:3000/api/workouts/exercises/goal', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExercises(response.data);
      } catch (error) {
        console.error('Error fetching exercises:', error.response?.data?.message || 'An unknown error occurred');
      }
    };

    fetchExercises();
  }, []);

  const toggleExerciseSelection = (exerciseId) => {
    setSelectedExercises((prevSelectedExercises) => {
      const updatedSelection = new Set(prevSelectedExercises);
      if (updatedSelection.has(exerciseId)) {
        updatedSelection.delete(exerciseId);
      } else {
        updatedSelection.add(exerciseId);
      }
      return updatedSelection;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found, can't submit workouts");
      return;
    }
    const decoded = jwtDecode(token); // Decode the token to get the userId
    const userId = decoded.userId; // Extract userId from decoded token

    try {
      await axios.post('http://localhost:3000/api/selections/workouts', {
        userId,
        workoutIds: Array.from(selectedExercises),
        date: new Date().toISOString().split('T')[0],
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Workouts saved successfully!');
      setSelectedExercises(new Set()); // Clear selections after successful save
    } catch (error) {
      console.error('Failed to save workout selections:', error);
    }
  };

  return (
    <div className="workout-page">
      <h1>Your Personalized Workout Plan</h1>
      {exercises.length === 0 ? (
        <p>No exercises found. Try updating your goals in your profile.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <ul className="exercise-list">
            {exercises.map((exercise) => (
              <li key={exercise.id} className="exercise-item">
                <div className="exercise-details">
                  <input
                    type="checkbox"
                    id={`exercise-${exercise.id}`}
                    checked={selectedExercises.has(exercise.id)}
                    onChange={() => toggleExerciseSelection(exercise.id)}
                  />
                  <label htmlFor={`exercise-${exercise.id}`}>
                    <h2>{exercise.name}</h2>
                    <img src={exercise.gifUrl} alt={exercise.name} style={{ width: '100%', height: 'auto' }} />
                    <p>Body Part: {exercise.bodyPart}</p>
                    <p>Equipment: {exercise.equipment}</p>
                    <p>Instructions: <span dangerouslySetInnerHTML={{ __html: exercise.instructions }} /></p>
                  </label>
                </div>
              </li>
            ))}
          </ul>
          <button type="submit">OK</button>
        </form>
      )}
    </div>
  );
};

export default WorkoutPage;