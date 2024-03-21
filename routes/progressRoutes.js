const express = require('express');
const { Progress } = require('../db');
const authenticateToken = require('../middleware');

const router = express.Router();

// Create progress entry
router.post('/', authenticateToken, async (req, res) => {
  const { date, weight, bodyFatPercentage, muscleMass } = req.body;
  try {
    const newProgress = await Progress.create({
      userId: req.user.userId,
      date,
      weight,
      bodyFatPercentage,
      muscleMass
    });
    res.status(201).json(newProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating progress entry" });
  }
});

// Read progress entries (list)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const progressEntries = await Progress.findAll({
      where: { userId: req.user.userId }
    });
    res.json(progressEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching progress entries" });
  }
});

// Read a single progress entry
router.get('/:progressId', authenticateToken, async (req, res) => {
  const { progressId } = req.params;
  try {
    const progressEntry = await Progress.findOne({
      where: { progressId, userId: req.user.userId }
    });
    if (!progressEntry) {
      return res.status(404).json({ message: "Progress entry not found" });
    }
    res.json(progressEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching progress entry" });
  }
});

// Update a progress entry
router.put('/:progressId', authenticateToken, async (req, res) => {
  const { progressId } = req.params;
  const { date, weight, bodyFatPercentage, muscleMass } = req.body;
  try {
    const [updated] = await Progress.update({
      date,
      weight,
      bodyFatPercentage,
      muscleMass
    }, {
      where: { progressId, userId: req.user.userId }
    });
    if (!updated) {
      return res.status(404).json({ message: "Progress entry not found" });
    }
    res.json({ message: "Progress entry updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating progress entry" });
  }
});

// Delete a progress entry
router.delete('/:progressId', authenticateToken, async (req, res) => {
  const { progressId } = req.params;
  try {
    const deleted = await Progress.destroy({
      where: { progressId, userId: req.user.userId }
    });
    if (!deleted) {
      return res.status(404).json({ message: "Progress entry not found" });
    }
    res.json({ message: "Progress entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting progress entry" });
  }
});

module.exports = router;