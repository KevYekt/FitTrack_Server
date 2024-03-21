require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const { User, UserProfile } = require("../db");
const authenticateToken = require("../middleware"); // Adjusted import based on actual middleware file

const router = express.Router();

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
};

// User registration
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO Users (username, email, passwordHash) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    connection.end();
    res.status(201).send({ message: "User created", userId: result.insertId });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ message: "Error creating user" });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    connection.end();

    if (users.length === 0) {
      return res.status(401).send({ message: "Authentication failed" });
    }

    const user = users[0];
    const isEqual = await bcrypt.compare(password, user.passwordHash);

    if (!isEqual) {
      return res.status(401).send({ message: "Authentication failed" });
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.send({ token, userId: user.userId });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "Error logging in user" });
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    // Implementation assumes UserProfile is correctly set up to query the profile
    const userProfile = await UserProfile.findOne({
      where: { userId: req.user.userId },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving profile" });
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  const { age, weight, fitnessGoals, dietaryPreferences } = req.body;

  try {
    // Implementation assumes UserProfile is correctly set up to update the profile
    const updatedProfile = await UserProfile.update(
      { age, weight, fitnessGoals, dietaryPreferences },
      { where: { userId: req.user.userId } }
    );

    res.json({ message: "Profile updated successfully", updatedProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router; // Export the router