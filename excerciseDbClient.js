const axios = require('axios');

// Set up axios instance with ExerciseDB API base URL and headers
const exerciseDbApi = axios.create({
  baseURL: 'https://exercisedb.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }
});

// Function to get exercises by type
const getExercisesByType = async (type) => {
  try {
    const response = await exerciseDbApi.get(`/exercises/bodyPart/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercises by type (${type}):`, error);
    throw error;
  }
};

module.exports = { getExercisesByType };