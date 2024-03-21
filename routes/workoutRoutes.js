require('dotenv').config(); // Ensure environment variables are loaded (if needed)
const express = require('express');
const { Workout } = require('../db'); // Adjust path as needed
const authenticateToken = require('../middleware');
const { getExercisesByType } = require('../excerciseDbClient'); // Adjust path as needed

const router = express.Router();

// Create a new workout plan
router.post('/', authenticateToken, async (req, res) => {
  const { date, type, duration, intensity } = req.body;
  try {
    const newWorkout = await Workout.create({
      userId: req.user.userId,
      date,
      type,
      duration,
      intensity
    });
    res.status(201).json(newWorkout);
  } catch (error) {
    console.error('Error creating a workout plan:', error);
    res.status(500).json({ message: "Error creating workout plan" });
  }
});

// Get all workout plans for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const workouts = await Workout.findAll({
      where: { userId: req.user.userId }
    });
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ message: "Error fetching workouts" });
  }
});

// Get a specific workout plan by ID
router.get('/:workoutId', authenticateToken, async (req, res) => {
  const { workoutId } = req.params;
  try {
    const workout = await Workout.findOne({
      where: { workoutId, userId: req.user.userId }
    });
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json(workout);
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).json({ message: "Error fetching workout" });
  }
});

// Update a specific workout plan
router.put('/:workoutId', authenticateToken, async (req, res) => {
  const { workoutId } = req.params;
  const { date, type, duration, intensity } = req.body;
  try {
    const [updated] = await Workout.update({
      date,
      type,
      duration,
      intensity
    }, {
      where: { workoutId, userId: req.user.userId }
    });
    if (!updated) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json({ message: "Workout updated successfully" });
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ message: "Error updating workout" });
  }
});

// Delete a specific workout plan
router.delete('/:workoutId', authenticateToken, async (req, res) => {
  const { workoutId } = req.params;
  try {
    const deleted = await Workout.destroy({
      where: { workoutId, userId: req.user.userId }
    });
    if (!deleted) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ message: "Error deleting workout" });
  }
});

router.get('/exercises/type/:type', authenticateToken, async (req, res) => {
    const { type } = req.params;
  
    try {
      const exercises = await getExercisesByType(type);
      res.json(exercises);
    } catch (error) {
      console.error(`Error fetching exercises for type ${type}:`, error);
      res.status(500).json({ message: `Error fetching exercises for type ${type}` });
    }
  });
  
module.exports = router;