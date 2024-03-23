import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NutritionLogsPage.scss';

const NutritionLogsPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication error. Please log in.');
          return;
        }
        const response = await axios.get('http://localhost:3000/api/nutrition/recipesByNutrients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecipes(response.data);
      } catch (err) {
        setError('Failed to fetch recipes.');
        console.error(err);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="nutrition-logs-page">
      <h1>Recommended Recipes</h1>
      {error && <p className="error">{error}</p>}
      <ul className="recipe-list">
        {recipes.map((recipe, index) => (
          <li key={index} className="recipe-card">
            <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
            <h3>{recipe.title}</h3>
            <div>Calories: {recipe.calories}</div>
            <div>Protein: {recipe.protein}</div>
            <div>Carbs: {recipe.carbs}</div>
            <div>Fats: {recipe.fat}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NutritionLogsPage;