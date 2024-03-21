// protectedRoutes.js
const express = require('express');
const authenticateToken = require('../middleware');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  res.json({ message: "You're accessing a protected route", user: req.user });
});

module.exports = router;