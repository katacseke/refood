import userService from './userService';
import applicationService from './applicationService';
import { Restaurant } from '../models';
import connectDb from '../db';

/**
 * Get restaurant ids.
 * @returns {Array} Array of restauratn ids.
 */
const getRestaurantIds = async () => {
  await connectDb();

  const restaurants = await Restaurant.find({}).select('_id').exec();

  return restaurants.map((restaurant) => restaurant._id.toString());
};

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

  return { success: true, data: restaurants };
};

/**
 * Get restaurants with a specific owner
 * @returns {String} Id of the given restaurant or error message.
 */
const getRestaurantIdWithOwner = async (ownerId) => {
  await connectDb();

  const restaurantId = await Restaurant.find({ ownerId }).select('_id').exec();

  return restaurantId
    ? { success: false, error: 'Restaurant not found' }
    : { success: true, data: restaurantId.toString() };
};

/**
 * Insert restaurant.
 * @param {Restaurant} restaurant
 * @returns {Object} Returns an object with error message or success
 */
const createRestaurant = async (restaurantData, application) => {
  const connection = await connectDb();

  const { name, email, phone, url, description, address, loginEmail, password } = restaurantData;
  const user = { name, email: loginEmail, password };

  try {
    const data = await connection.transaction(async () => {
      const userResult = await userService.createUser(user, 'restaurant');

      const restaurant = {
        name,
        email,
        phone,
        url,
        description,
        address,
        ownerId: userResult.data.id,
      };
      const restaurantResult = await Restaurant.create(restaurant);

      await applicationService.updateApplicationStatus(application.id, 'registered');

      return restaurantResult;
    });

    return { success: true, data };
  } catch (err) {
    console.log(err);
    return { success: false, error: 'Unable to create restaurant.' };
  }
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
  getRestaurantIds,
  getRestaurantById,
  getRestaurants,
  getRestaurantsWithName,
  getRestaurantIdWithOwner,
  createRestaurant,
  updateRestaurant,
};
