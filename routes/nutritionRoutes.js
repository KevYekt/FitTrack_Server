require('dotenv').config(); // Ensure this is at the top if using .env for configurations
const express = require('express');
const { NutritionLog } = require('../db'); // Adjust path as needed
const authenticateToken = require('../middleware');
const { getNutritionalInfo } = require('../nutritionixClient');

const router = express.Router();

// Middleware to parse JSON bodies already included in server.js

// Log daily food intake with Nutritionix integration
router.post('/', authenticateToken, async (req, res) => {
  const { date, foodQuery } = req.body; // Expecting a foodQuery for Nutritionix
  
  try {
    // Fetch nutritional information from Nutritionix based on foodQuery
    const nutritionalInfo = await getNutritionalInfo(foodQuery);
    if (nutritionalInfo && nutritionalInfo.length > 0) {
      // Assuming we're interested in the first result
      const { calories, protein, carbs, fats } = nutritionalInfo[0]; // Destructure relevant data
      
      // Create a new nutrition log with fetched data
      const newLog = await NutritionLog.create({
        userId: req.user.userId,
        date, 
        foodItem: foodQuery, // Using query as item description
        calories, 
        protein, 
        carbs, 
        fats
      });
      res.status(201).json(newLog);
    } else {
      res.status(400).json({ message: "No nutritional information found for the provided food query." });
    }
  } catch (error) {
    console.error('Error logging food intake with Nutritionix data:', error);
    res.status(500).json({ message: "Error logging food intake" });
  }
});

// Get all nutrition logs for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const logs = await NutritionLog.findAll({
      where: { userId: req.user.userId }
    });
    res.json(logs);
  } catch (error) {
    console.error('Error retrieving nutrition logs:', error);
    res.status(500).json({ message: "Error retrieving nutrition logs" });
  }
});

// Get a single nutrition log by ID
router.get('/:logId', authenticateToken, async (req, res) => {
  const { logId } = req.params;
  try {
    const log = await NutritionLog.findOne({
      where: { logId, userId: req.user.userId }
    });
    if (log) {
      res.json(log);
    } else {
      res.status(404).json({ message: "Nutrition log not found" });
    }
  } catch (error) {
    console.error('Error retrieving nutrition log:', error);
    res.status(500).json({ message: "Error retrieving nutrition log" });
  }
});

// Update a nutrition log
router.put('/:logId', authenticateToken, async (req, res) => {
  const { logId } = req.params;
  const { foodItem, calories, protein, carbs, fats } = req.body; // Assuming manual update allows all fields
  try {
    const updated = await NutritionLog.update({
      foodItem, calories, protein, carbs, fats
    }, {
      where: { logId, userId: req.user.userId }
    });
    if (updated[0] > 0) {
      res.json({ message: "Nutrition log updated successfully" });
    } else {
      res.status(404).json({ message: "Nutrition log not found" });
    }
  } catch (error) {
    console.error('Error updating nutrition log:', error);
    res.status(500).json({ message: "Error updating nutrition log" });
  }
});

// Delete a nutrition log
router.delete('/:logId', authenticateToken, async (req, res) => {
  const { logId } = req.params;
  try {
    const deleted = await NutritionLog.destroy({
      where: { logId, userId: req.user.userId }
    });
    if (deleted) {
      res.json({ message: "Nutrition log deleted successfully" });
    } else {
      res.status(404).json({ message: "Nutrition log not found" });
    }
  } catch (error) {
    console.error('Error deleting nutrition log:', error);
    res.status(500).json({ message: "Error deleting nutrition log" });
  }
});

module.exports = router;