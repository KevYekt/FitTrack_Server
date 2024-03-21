// exerciseDbClient.js
const axios = require('axios');

const exerciseDbApi = axios.create({
  baseURL: 'https://example-exercisedb.com/api', // Replace with the actual Base URL of ExerciseDB
});

const getExercisesByType = async (type) => {
  try {
    const response = await exerciseDbApi.get(`/exercises/type/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercises by type (${type}):`, error);
    throw error;
  }
};

module.exports = { getExercisesByType };