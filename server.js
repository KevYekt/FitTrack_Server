const express = require('express');
const userRoutes = require('./routes/userRoutes.js');
const protectedRoutes = require('./routes/protectedRoutes.js'); // Import the protected routes
const workoutRoutes = require('./routes/workoutRoutes.js');
const progressRoutes = require('./routes/progressRoutes.js');
const nutritionRoutes = require('./routes/nutritionRoutes.js'); // Adjust the path as needed
const cors = require('cors');
const app = express();

app.use(cors());




app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/protected', protectedRoutes); // Use the protected routes
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/progress',progressRoutes);
app.use('/api/workouts',workoutRoutes);






const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));