const axios = require('axios');

// Nutritionix API credentials from  environment variables
const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;

// Configure Axios instance for Nutritionix API
const nutritionixApi = axios.create({
  baseURL: 'https://trackapi.nutritionix.com/v2',
  headers: {
    'x-app-id': NUTRITIONIX_APP_ID,
    'x-app-key': NUTRITIONIX_API_KEY,
    'Content-Type': 'application/json',
  },
});

/**
 * Fetches nutritional information for a given query (e.g., a food item).
 * @param {string} query - The query string to search for (e.g., "1 apple").
 * @returns {Promise<Object>} The nutritional information for the query.
 */
const getNutritionalInfo = async (query) => {
  try {
    // Make a POST request to the Nutritionix "natural/nutrients" endpoint
    const response = await nutritionixApi.post('/natural/nutrients', { query });
    return response.data.foods[0]; // Assuming you're interested in the first result
  } catch (error) {
    console.error('Error fetching nutritional info from Nutritionix:', error);
    throw error; // Rethrow error to handle it in the calling function
  }
};

module.exports = { getNutritionalInfo };