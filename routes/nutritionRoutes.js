const express = require('express');
const { UserProfile } = require('../db');
const authenticateToken = require('../middleware');
const axios = require('axios');

const router = express.Router();

// Axios instance for Spoonacular API
const spoonacularApi = axios.create({
    baseURL: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    headers: {
        'X-RapidAPI-Key': process.env.SPOONACULAR_API_KEY,
        'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    },
});

// Route to fetch recipes based on the user's dietary preferences stored in their profile
router.get('/recipesByNutrients', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    // Retrieve user's dietary preferences from UserProfile
    const userProfile = await UserProfile.findOne({ where: { userId } });
    if (!userProfile || !userProfile.dietaryPreferences) {
      return res.status(404).json({ message: "User's dietary preferences not found." });
    }

    const dietaryPreferences = JSON.parse(userProfile.dietaryPreferences);

    const params = {
        number: '10', 
        minProtein: dietaryPreferences.includes('high protein') ? '50' : undefined,
        minCalories: dietaryPreferences.includes('high calories') ? '500' : undefined,
        maxCalories: dietaryPreferences.includes('low calories') ? '300' : undefined,
        minFat: dietaryPreferences.includes('high fat') ? '30' : undefined,
        maxCarbs: dietaryPreferences.includes('low carbs') ? '20' : undefined,
        minCarbs: dietaryPreferences.includes('high carbs') ? '40' : undefined,
    };

    // Remove undefined parameters
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    const response = await spoonacularApi.get('/recipes/findByNutrients', { params });
    res.status(200).json(response.data.slice(0, 10));
  } catch (error) {
    console.error('Error fetching recipes by nutrients:', error);
    res.status(500).json({ message: "Error fetching recipes by nutrients" });
  }
});

module.exports = router;