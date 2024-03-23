const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize('fittrack_db', 'root', 'rootroot', {
  host: 'localhost',
  dialect: 'mysql'
});

// Define Models
const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING
  }
}, { timestamps: true });

const UserProfile = sequelize.define('UserProfile', {
  profileId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  age: DataTypes.INTEGER,
  weight: DataTypes.FLOAT,
  fitnessGoals: {
    type: DataTypes.STRING, // Changed from DataTypes.JSON to DataTypes.STRING
    // No custom getter or setter needed for string type
  },  dietaryPreferences: {
    type: DataTypes.JSON, // Now Sequelize expects JSON object
  },
}, { timestamps: true });

const Workout = sequelize.define('Workout', {
  workoutId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bodyPart: {
    type: DataTypes.STRING,
    allowNull: true // Only set if relevant to the type of workout
  },
date: DataTypes.DATEONLY,
  type: DataTypes.STRING,
  duration: DataTypes.INTEGER,
  intensity: DataTypes.STRING
}, { timestamps: true });

const Exercise = sequelize.define('Exercise', {
  exerciseId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: DataTypes.STRING,
  sets: DataTypes.INTEGER,
  reps: DataTypes.INTEGER,
  weight: DataTypes.FLOAT
}, { timestamps: true });

const NutritionLog = sequelize.define('NutritionLog', {
  logId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: DataTypes.DATEONLY,
  foodItem: DataTypes.STRING,
  calories: DataTypes.INTEGER,
  protein: DataTypes.FLOAT,
  carbs: DataTypes.FLOAT,
  fat: DataTypes.FLOAT
}, { timestamps: true });

const Progress = sequelize.define('Progress', {
  progressId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: DataTypes.DATEONLY,
  weight: DataTypes.FLOAT,
  bodyFatPercentage: DataTypes.FLOAT,
  muscleMass: DataTypes.FLOAT
}, { timestamps: true });

// Define Associations
User.hasOne(UserProfile, { foreignKey: 'userId' });
UserProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Workout, { foreignKey: 'userId' });
Workout.belongsTo(User, { foreignKey: 'userId' });

Workout.hasMany(Exercise, { foreignKey: 'workoutId' });
Exercise.belongsTo(Workout, { foreignKey: 'workoutId' });

User.hasMany(NutritionLog, { foreignKey: 'userId' });
NutritionLog.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Progress, { foreignKey: 'userId' });
Progress.belongsTo(User, { foreignKey: 'userId' });

// Synchronize models with the database
sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
});

module.exports = {
  User,
  UserProfile,
  Workout,
  Exercise,
  NutritionLog,
  Progress
};