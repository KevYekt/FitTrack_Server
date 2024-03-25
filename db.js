const { Sequelize, DataTypes } = require('sequelize');

let sequelize;

// Check for JAWSDB_URL to use JawsDB on Heroku
if (process.env.JAWSDB_URL) {
  // Use JawsDB database on Heroku
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  // Use local database for development
  sequelize = new Sequelize('fittrack_db', 'root', 'rootroot', {
    host: 'localhost',
    dialect: 'mysql'
  });
}

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
  goalWeight: DataTypes.FLOAT, 
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
  externalId: {
    type: DataTypes.STRING, // Assuming external API gives a unique ID for the workout
    allowNull: true // Set true if not all workouts are from external API
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false // Assuming the workout's name is always provided
  },
  bodyPart: {
    type: DataTypes.STRING,
    allowNull: true // Set true if the body part may not always be provided
  },
  equipment: {
    type: DataTypes.STRING,
    allowNull: true // Set true if the equipment may not always be provided
  },
  target: {
    type: DataTypes.STRING,
    allowNull: true // Set true if the target muscle group may not always be provided
  },
  gifUrl: {
    type: DataTypes.STRING,
    allowNull: true // Set true if the gif URL may not always be provided
  },
  instructions: {
    type: DataTypes.TEXT, // TEXT type for potentially long strings
    allowNull: true // Set true if the instructions may not always be provided
  },
}, {
  timestamps: true, // Enable timestamps if you want createdAt and updatedAt
});

module.exports = Workout;

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

const WorkoutSelection = sequelize.define('WorkoutSelection', {
  selectionId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', 
      key: 'userId',
    }
  },
  workoutId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Workouts', 
      key: 'workoutId',
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, { timestamps: true });

const RecipeSelection = sequelize.define('RecipeSelection', {
  selectionId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'userId',
    }
  },
  recipeId: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, { timestamps: true });


// Adjusting UserWorkouts model
const UserWorkouts = sequelize.define('UserWorkouts', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'userId',
    }
  },
  workoutId: { // Changed from workoutId to externalWorkoutId
    type: DataTypes.STRING, // Assuming external IDs are strings
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, { timestamps: true });

// Define Associations
User.hasOne(UserProfile, { foreignKey: 'userId' });
UserProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Workout, { foreignKey: 'userId' });
Workout.belongsTo(User, { foreignKey: 'userId' });



User.hasMany(NutritionLog, { foreignKey: 'userId' });
NutritionLog.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Progress, { foreignKey: 'userId' });
Progress.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(WorkoutSelection, { foreignKey: 'userId' });
WorkoutSelection.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(RecipeSelection, { foreignKey: 'userId' });
RecipeSelection.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Workout, { through: UserWorkouts, foreignKey: 'userId' });
Workout.belongsToMany(User, { through: UserWorkouts, foreignKey: 'workoutId' });

// Synchronize models with the database
sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
});

module.exports = {
  User,
  UserProfile,
  Workout,
  NutritionLog,
  Progress,
  WorkoutSelection,
  RecipeSelection,
  UserWorkouts, 
};