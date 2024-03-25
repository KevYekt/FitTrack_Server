import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './NutritionLogsPage.scss';

const NutritionLogsPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState(new Set());
  const [error, setError] = useState('');
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {

    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication error. Please log in.');
          return;
        }
        const response = await axios.get(`${BASE_URL}/api/nutrition/recipesByNutrients`, {
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

  const toggleRecipeSelection = (recipeId) => {
    setSelectedRecipes(prevSelectedRecipes => {
      const updatedSelections = new Set(prevSelectedRecipes);
      if (updatedSelections.has(recipeId)) {
        updatedSelections.delete(recipeId);
      } else {
        updatedSelections.add(recipeId);
      }
      return updatedSelections;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError("You're not logged in. Please log in to save your selections.");
      return;
    }
    const recipeIdsArray = Array.from(selectedRecipes);
    
    try {
      await axios.post(`${BASE_URL}api/selections/recipes`, {
        recipeIds: recipeIdsArray,
        date: new Date().toISOString().split('T')[0],
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Recipes saved successfully!');
      setSelectedRecipes(new Set());
    } catch (error) {
      console.error('Error saving recipes:', error);
      setError('Failed to save recipes. Please try again.');
    }
  };

  return (
    <div className="nutrition-logs-page">
      <h1>Recommended Recipes</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <ul className="recipe-list">
          {recipes.length === 0 ? (
            <p>No recipes found. Please adjust your dietary preferences in your profile.</p>
          ) : (
            recipes.map((recipe, index) => (
              <li key={index} className="recipe-card">
                <input
                  type="checkbox"
                  id={`recipe-${recipe.id}`}
                  checked={selectedRecipes.has(recipe.id)}
                  onChange={() => toggleRecipeSelection(recipe.id)}
                />
                <label htmlFor={`recipe-${recipe.id}`}>
                  <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                  <h3>{recipe.title}</h3>
                  <div>Calories: {recipe.calories}</div>
                  <div>Protein: {recipe.protein}</div>
                  <div>Carbs: {recipe.carbs}</div>
                  <div>Fats: {recipe.fat}</div>
                </label> 
              </li>
           )))}
        </ul>
        <button type="submit" className="submit-button">OK</button>
      </form>
    </div>
  );
};

export default NutritionLogsPage;