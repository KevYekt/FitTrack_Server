const express = require('express');
const { User, UserWorkouts, RecipeSelection } = require('../db');
const authenticateToken = require('../middleware');
const router = express.Router();

// POST route for adding a workout selection with external workout IDs
router.post('/workouts', authenticateToken, async (req, res) => {
    // Changed parameter name from workoutIds to externalWorkoutIds for clarity
    const { userId, externalWorkoutIds, date } = req.body; // **CHANGED**

    try {
      // Verify the user exists
      const userExists = await User.findByPk(userId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Prepare workout selection records using externalWorkoutIds
      // Changed to use externalWorkoutId in the map function
      const workoutSelections = externalWorkoutIds.map(externalWorkoutId => ({ // **CHANGED**
        userId,
        externalWorkoutId, // **CHANGED** (assuming your UserWorkouts model now has an externalWorkoutId field)
        date
      }));
  
      // Bulk create UserWorkouts records with externalWorkoutIds
      await UserWorkouts.bulkCreate(workoutSelections); // **CHANGED** (implicitly, due to externalWorkoutId usage)
  
      res.status(201).json({ message: "Workout selections saved successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error saving workout selections" });
    }
});

// POST route for adding a recipe selection remains unchanged
router.post('/recipes', authenticateToken, async (req, res) => {
  const { userId, recipeId, date } = req.body; // No changes here

  try {
    const newSelection = await RecipeSelection.create({
      userId,
      recipeId,
      date
    });

    res.status(201).json(newSelection);
  } catch (error) {
    console.error('Error adding recipe selection:', error);
    res.status(500).json({ message: 'Error adding recipe selection' });
  }
});

// GET route for retrieving workout selections may need adjustments if you decide to fetch workout details from the external API
router.get('/workouts', authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const selections = await UserWorkouts.findAll({
      where: { userId }
    });

    // Additional logic might be needed here to fetch workout details from the external API based on externalWorkoutIds
    // This part remains conceptual until implemented

    res.json(selections);
  } catch (error) {
    console.error('Error fetching workout selections:', error);
    res.status(500).json({ message: 'Error fetching workout selections' });
  }
});

// GET route for retrieving recipe selections remains unchanged
router.get('/recipes', authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const selections = await RecipeSelection.findAll({
      where: { userId }
    });

    res.json(selections);
  } catch (error) {
    console.error('Error fetching recipe selections:', error);
    res.status(500).json({ message: 'Error fetching recipe selections' });
  }
});

module.exports = router;