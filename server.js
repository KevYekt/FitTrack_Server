const express = require('express');

const path = require('path');
const userRoutes = require('./routes/userRoutes.js');
const protectedRoutes = require('./routes/protectedRoutes.js');
const workoutRoutes = require('./routes/workoutRoutes.js');
const progressRoutes = require('./routes/progressRoutes.js');
const nutritionRoutes = require('./routes/nutritionRoutes.js');
const selectionRoutes = require('./routes/selectionRoutes');
const sequelize = require('./connection.js');

const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'Client', 'build')));

// API endpoints
app.use('/api/users', userRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/selections', selectionRoutes);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Client', 'build', 'index.html'));
});

sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((error) => {
  console.log('Error syncing database: ', error);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});