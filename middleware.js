const jwt = require('jsonwebtoken');

// Middleware to authenticate and authorize users
const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // if no token is found, return Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // if the token doesn't verify, return Forbidden
    req.user = user; // Add the user payload to the request object
    next(); // proceed to the next middleware/function
  });
};


module.exports = authenticateToken;
