import userService from './userService';
import { Restaurant, Application } from '../models';
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
const createRestaurant = async (data) => {
  await connectDb();

  const { name, email, phone, url, description, address, loginEmail, password } = data;
  const user = { name, email: loginEmail, password };

  const userResult = await userService.createUser(user, 'restaurant');

  if (!userResult.success) {
    return userResult;
  }

  const restaurant = { name, email, phone, url, description, address, ownerId: userResult.data.id };
  const restaurantResult = await Restaurant.create(restaurant);

  return restaurantResult
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

/**
 * Get application by id.
 * @param {string} id
 * @returns {
 *   success: Boolean,
 *   ?application: Application,
 *   ?error: String,
 * } Returns an object containing the Application instance or an error message
 */
const getApplicationById = async (id) => {
  await connectDb();

  const application = await Application.findById(id).exec();

  if (!application) {
    return {
      success: false,
      error: 'Application not found',
    };
  }

  return {
    success: true,
    data: application,
  };
};

/**
 * Get pending application by token.
 * @param {string} token
 * @returns {
 *   success: Boolean,
 *   ?application: Application,
 *   ?error: String,
 * } Returns an object containing the Application instance or an error message
 */
const getPendingApplicationByToken = async (token) => {
  await connectDb();

  const application = await Application.findOne({ token, status: 'pending' }).exec();

  if (!application) {
    return {
      success: false,
      error: 'Application not found',
    };
  }

  return {
    success: true,
    data: application,
  };
};

/**
 * Get all applications.
 * @returns {Array} Array of all applications.
 */
const getApplications = async () => {
  await connectDb();

  const applications = await Application.find({}).exec();
  return { success: true, data: applications };
};

/**
 * Insert application.
 * @param {Application} application
 * @returns {Object} Returns an object with error message or success
 */
const createApplication = async (application) => {
  await connectDb();

  const result = await Application.create({ ...application, status: 'pending' });

  return result
    ? { success: true, data: application }
    : { success: false, error: 'Unable to insert data.' };
};

export default {
  getRestaurantById,
  getRestaurants,
  getRestaurantsWithName,
  createRestaurant,
  updateRestaurant,
  getApplicationById,
  getPendingApplicationByToken,
  getApplications,
  createApplication,
};
