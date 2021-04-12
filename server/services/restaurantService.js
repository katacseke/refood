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

  return restaurants.map((restaurant) => restaurant.id.toString());
};

/**
 * Get restaurant with a specific owner
 * @param {String} ownerId id of the restaurant owner
 * @returns {String} Id of the given restaurant or error message.
 */
const getRestaurantIdByOwner = async (ownerId) => {
  await connectDb();

  const restaurantId = await Restaurant.find({ ownerId }).select('_id').exec();

  return restaurantId
    ? { success: false, error: 'Restaurant not found' }
    : { success: true, data: restaurantId.toString() };
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

  const restaurant = (await Restaurant.findById(id).exec()).toObject();

  return restaurant
    ? { success: true, data: restaurant }
    : { success: false, error: 'Restaurant not found' };
};

/**
 * Get all restaurants.
 * @returns {Array} Array of all restaurants.
 */
const getRestaurants = async () => {
  await connectDb();

  const restaurants = (await Restaurant.find({}).exec()).map((restaurant) => restaurant.toObject());
  return { success: true, data: restaurants };
};

/**
 * Get restaurants with a specific name
 * @returns {Array} Array of all restaurants.
 */
const getRestaurantsWithName = async (text) => {
  await connectDb();

  const regex = new RegExp(text, 'i');
  const restaurants = (
    await Restaurant.find({ name: { $regex: regex } }).exec()
  ).map((restaurant) => restaurant.toObject());

  return { success: true, data: restaurants };
};

/**
 * Insert restaurant.
 * @param {Restaurant} restaurantData
 * @param {Object} application application for registration
 * @returns {Object} Returns an object with error message or success
 */
const createRestaurant = async (restaurantData, application) => {
  const connection = await connectDb();

  const { name, email, phone, url, description, address, loginEmail, password } = restaurantData;
  const user = { name, email: loginEmail, password };

  try {
    const data = await connection.transaction(async () => {
      // Create the user
      let userResult = await userService.createUser(user, 'restaurant');
      if (!userResult.success) {
        throw new Error(userResult.error);
      }

      // Create the restaurant associated with the user
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

      // Bind the restaurant to the user
      userResult = await userService.updateUser(userResult.data.id, {
        restaurantId: restaurantResult.id,
      });
      if (!userResult.success) {
        throw new Error(userResult.error);
      }

      // Set the application status to registered
      await applicationService.updateApplicationStatus(application.id, 'registered');

      return restaurantResult.toObject();
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
const updateRestaurant = async (id, restaurantData) => {
  const connection = await connectDb();

  const {
    name,
    email,
    phone,
    url,
    description,
    address,
    loginEmail,
    password,
    ownerId,
  } = restaurantData;
  const user = { name, email: loginEmail, password };

  try {
    const data = await connection.transaction(async () => {
      // Update the user
      const userResult = await userService.updateUser(ownerId, user);
      if (!userResult.success) {
        throw new Error(userResult.error);
      }

      // Update the restaurant associated with the user
      const restaurant = {
        name,
        email,
        phone,
        url,
        description,
        address,
      };
      const restaurantResult = await Restaurant.findByIdAndUpdate(id, restaurant, {
        new: true,
      }).exec();

      return restaurantResult.toObject();
    });

    return { success: true, data };
  } catch (err) {
    console.log(err);
    return { success: false, error: 'Az adatok frissítése sikertelen.' };
  }
};

export default {
  getRestaurantIds,
  getRestaurantById,
  getRestaurants,
  getRestaurantsWithName,
  getRestaurantIdByOwner,
  createRestaurant,
  updateRestaurant,
};
