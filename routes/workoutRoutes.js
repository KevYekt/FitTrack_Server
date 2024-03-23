require('dotenv').config();
const express = require('express');
const { Exercise, UserProfile } = require('../db'); // Ensure these are correctly imported
const authenticateToken = require('../middleware'); // Ensure correct path
const axios = require('axios');
const router = express.Router();

// Axios instance for ExerciseDB API
const exerciseDbApi = axios.create({
  baseURL: 'https://exercisedb.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
  },
});

// Fetch exercises based on user's fitness goals
router.get('/exercises/goal', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    // Retrieve the user's fitness goal from the UserProfile
    const userProfile = await UserProfile.findOne({
      where: { userId },
    });

    if (!userProfile || !userProfile.fitnessGoals) {
      return res.status(404).json({ message: "User's fitness goal not found." });
    }

    const bodyPart = userProfile.fitnessGoals; 

    // Fetch exercises from ExerciseDB API based on body part
    const response = await exerciseDbApi.get(`/exercises/bodyPart/${encodeURIComponent(bodyPart)}`);
    if(response.data.length > 0) {
      // Directly send the API's response to the frontend
      res.status(200).json(response.data.slice(0, 10)); // Limit to first 10 exercises
    } else {
      res.status(404).json({ message: 'No exercises found for this body part.' });
    }
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ message: 'Error fetching exercises' });
  }
});

module.exports = router;