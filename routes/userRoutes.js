require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, UserProfile } = require('../db');
const authenticateToken = require('../middleware');

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      username,
      email,
      passwordHash: hashedPassword
    });

    // Create user profile
    const newUserProfile = await UserProfile.create({
      userId: newUser.userId
    });

    // Send back the new user's information
    res.status(201).json({
      message: 'User and profile created successfully',
      user: {
        userId: newUser.userId,
        username: newUser.username,
        email: newUser.email
      },
      profile: {
        profileId: newUserProfile.profileId
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({ message: 'Error creating user' });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    // User not found
    if (!user) {
      return res.status(401).send({ message: 'Authentication failed' });
    }

    // Check password
    const isEqual = await bcrypt.compare(password, user.passwordHash);
    if (!isEqual) {
      return res.status(401).send({ message: 'Authentication failed' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send back token and user info

res.json({
  token,
  user: {
    userId: user.userId,
    username: user.username,
    email: user.email
  }
});
} catch (error) {
console.error('Login error:', error);
res.status(500).send({ message: 'Error logging in user' });
}
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({
      where: { userId: req.user.userId },
    });
    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(userProfile);
  } catch (error) {
    console.error('Error retrieving profile:', error);
    res.status(500).json({ message: 'Error retrieving profile' });
  }
});

// Update user profile
router.put('/profile/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params; 
  const { age, weight, fitnessGoals, dietaryPreferences, goalWeight, updateDate } = req.body;

  try {
    const userProfile = await UserProfile.findOne({
      where: { userId: userId } // Use the captured userId to find the profile
    });

    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    await userProfile.update({
      age,
      weight,
      fitnessGoals,
      dietaryPreferences,
      goalWeight,
      updatedAt: updateDate
      
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});




module.exports = router;

