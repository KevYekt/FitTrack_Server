const express = require('express');
const userRoutes = require('./routes/userRoutes.js');
const protectedRoutes = require('./routes/protectedRoutes.js'); // Import the protected routes
const workoutRoutes = require('./routes/workoutRoutes.js');
const progressRoutes = require('./routes/progressRoutes.js');
const nutritionRoutes = require('./routes/nutritionRoutes.js'); // Adjust the path as needed
const cors = require('cors');



const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/protected', protectedRoutes); // Use the protected routes
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/progress',progressRoutes);
app.use('/api/workouts',workoutRoutes);

const allowedOrigins = ['http://yourfrontenddomain.com'];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200, // For legacy browsers (IE11, various SmartTVs) that cannot handle 204 status
  credentials: true, // To allow cookies to be sent and received between front-end and back-end
};

// Use CORS middleware with the specified options
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));