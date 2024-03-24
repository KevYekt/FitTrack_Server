const express = require('express');
const { User, UserWorkouts, RecipeSelection } = require('../db');
const authenticateToken = require('../middleware');
const router = express.Router();
const { Progress } = require('../db');

// POST route for adding a workout selection with external workout IDs
router.post('/workouts', authenticateToken, async (req, res) => {
    // Changed parameter name from workoutIds to externalWorkoutIds for clarity
    const { userId, workoutIds, date } = req.body; // **CHANGED**

    try {
      // Verify the user exists
      const userExists = await User.findByPk(userId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Prepare workout selection records using externalWorkoutIds
      // Changed to use externalWorkoutId in the map function
      const workoutSelections = workoutIds.map(workoutId => ({ // **CHANGED**
        userId,
        workoutId, // **CHANGED** (assuming your UserWorkouts model now has an externalWorkoutId field)
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


router.post('/weight', authenticateToken, async (req, res) => {
  const { userId } = req.user; // Assuming userId is available in req.user after authentication
  const { date, weight } = req.body;

  try {
      // Optional: Validate input (e.g., date format, weight as a positive number)

      // Check if a weight entry for the specified date already exists
      const existingEntry = await Progress.findOne({
          where: { userId, date }
      });

      if (existingEntry) {
          // Update existing entry
          existingEntry.weight = weight;
          await existingEntry.save();
          res.status(200).json({ message: "Weight entry updated successfully" });
      } else {
          // Create new entry
          const newEntry = await Progress.create({
              userId,
              date,
              weight
          });
          res.status(201).json({ message: "Weight entry added successfully", entry: newEntry });
      }
  } catch (error) {
      console.error('Error managing weight entry:', error);
      res.status(500).json({ message: 'Error managing weight entry' });
  }
});

router.get('/weight/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  // Optional: Check if the authenticated user is allowed to fetch this data
  if (req.user.id !== parseInt(userId, 10)) {
      return res.status(403).json({ message: "Unauthorized access." });
  }

  try {
      const weightEntries = await Progress.findAll({
          where: { userId },
          order: [['date', 'ASC']] // Sorting by date in ascending order
      });

      res.status(200).json(weightEntries);
  } catch (error) {
      console.error('Error fetching weight data:', error);
      res.status(500).json({ message: 'Error fetching weight data' });
  }
});

module.exports = router;