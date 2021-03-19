import { Restaurant } from '../models';
import connectDb from '../db';

/**
 * Get restaurant by id.
 * @param {string} id
 * @returns {
 *   success: Boolean,
 *   ?restaurant: Restaurant,
 *   ?error: String,
 * } Returns an object containing the Restaurant instance or an error message
 */
const getRestaurantById = async (id) => {
  await connectDb();

  const restaurant = await Restaurant.findById(id).exec();

  if (!restaurant) {
    return {
      success: false,
      error: 'Restaurant not found',
    };
  }

  return {
    success: true,
    data: restaurant,
  };
};

/**
 * Get all restaurants.
 * @returns {Array} Array of all restaurants.
 */
const getRestaurants = async () => {
  await connectDb();

  const restaurants = await Restaurant.find({}).exec();
  return { success: true, data: restaurants };
};

/**
 * Get restaurants with a specific name
 * @returns {Array} Array of all restaurants.
 */
const getRestaurantsWithName = async (text) => {
  await connectDb();

  const regex = new RegExp(text, 'i');
  const restaurants = await Restaurant.find({ name: { $regex: regex } }).exec();

  /* if (!meals || !meals.length) {
    return {
      success: false,
      error: 'No meals found with this name.',
    };
  } */

  return { success: true, data: restaurants };
};

/**
 * Insert restaurant.
 * @param {Restaurant} restaurant
 * @returns {Object} Returns an object with error message or success
 */
const createRestaurant = async (restaurant) => {
  await connectDb();

  const result = await Restaurant.create(restaurant);

  return result
    ? { success: true, data: restaurant }
    : { success: false, error: 'Unable to insert data.' };
};

/**
 * Update restaurant.
 * @param {Restaurant} restaurant
 * @param {String} id
 * @returns {Object} Returns an object with error message or success
 */
const updateRestaurant = async (id, restaurant) => {
  await connectDb();

  const result = await Restaurant.findByIdAndUpdate(id, restaurant, { new: true });

  return result
    ? { success: true, data: restaurant }
    : { success: false, error: 'Unable to update data.' };
};

export default {
  getRestaurantById,
  getRestaurants,
  getRestaurantsWithName,
  createRestaurant,
  updateRestaurant,
};
