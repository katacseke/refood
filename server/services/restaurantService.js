import fs from 'fs';
import userService from './userService';
import applicationService from './applicationService';
import { Meal, Restaurant } from '../models';
import connectDb from '../db';
import { NotFoundError } from './errors';

/**
 * Get restaurant ids.
 *
 * @returns {Array<String>} Array of restaurant ids.
 */
const getRestaurantIds = async () => {
  await connectDb();

  const restaurants = await Restaurant.find({}).select('_id').exec();

  return restaurants.map((restaurant) => restaurant.id.toString());
};

/**
 * Get restaurant id with a specific owner.
 *
 * @param {String} ownerId Id of the restaurant owner.
 * @returns {String} Id of the given restaurant.
 *
 * @throws {NotFoundError} Throws NotFoundError when no restaurant
 *  was found for with the specified owner.
 */
const getRestaurantIdByOwner = async (ownerId) => {
  await connectDb();

  const restaurantId = await Restaurant.find({ ownerId }).select('_id').exec();

  if (!restaurantId) {
    throw new NotFoundError('A felhasználóhoz nem tartozik vendéglő.');
  }
  return restaurantId.toString();
};

/**
 * Get restaurant by id.
 *
 * @param {string} id
 * @returns {Object} Returns an object containing the Restaurant instance.
 *
 * @throws {NotFoundError} Throws NotFoundError when no restaurant
 *  was found with the id.
 */
const getRestaurantById = async (id) => {
  await connectDb();

  const restaurant = await Restaurant.findById(id).exec();

  if (!restaurant) {
    throw new NotFoundError('Nem létezik vendéglő a megadott azonosítóval.');
  }
  return restaurant.toObject();
};

/**
 * Get all restaurants.
 *
 * @returns {Array<Object>} Array of all restaurants.
 */
const getRestaurants = async () => {
  await connectDb();

  const restaurants = await Restaurant.find({}).exec();
  return restaurants.map((restaurant) => restaurant.toObject());
};

/**
 * Get restaurants with a specific name.
 *
 * @returns {Array} Array of all restaurants.
 */
const getRestaurantsWithName = async (text) => {
  await connectDb();

  const regex = new RegExp(text, 'i');
  const restaurants = await Restaurant.find({ name: { $regex: regex } }).exec();

  return restaurants.map((restaurant) => restaurant.toObject());
};

/**
 * Insert restaurant.
 *
 * @param {Object} restaurantData
 * @param {Object} application Application for registration.
 * @returns {Object} Returns the new restaurant instance.
 *
 *@throws {Error} Throws Error when insertion failed.
 */
const createRestaurant = async (restaurantData, application) => {
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
    image,
  } = restaurantData;
  const user = { name, email: loginEmail, phone, password };

  let transactionResult;
  await connection.transaction(async () => {
    // Create the user
    let userResult = await userService.createUser(user, 'restaurant');

    // Create the restaurant associated with the user
    const restaurant = {
      name,
      email,
      phone,
      url,
      description,
      address,
      ownerId: userResult.id,
      image,
    };
    const restaurantResult = await Restaurant.create(restaurant);

    if (!restaurantResult) {
      throw new Error('Nem sikerült létrehozni a vendéglőt');
    }

    // Bind the restaurant to the user
    userResult = await userService.updateUser(userResult.id, {
      restaurantId: restaurantResult.id,
    });

    // Set the application status to registered
    await applicationService.updateApplicationStatus(application.id, 'registered');

    transactionResult = restaurantResult.toObject();
  });

  return transactionResult;
};

/**
 * Update restaurant.
 *
 * @param {Object} restaurantData
 * @param {String} id
 * @returns {Object} Returns the updated restaurant instance.
 *
 * @throws {Error} Throws Error when update failed.
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
    image,
  } = restaurantData;
  const user = { name, email: loginEmail, phone, password };

  let transactionResult;
  await connection.transaction(async () => {
    // Update the user
    await userService.updateUser(ownerId, user);

    // Update restaurant names at meals
    await Meal.updateMany({ restaurantId: id }, { restaurantName: name });

    // Update the restaurant associated with the user
    const restaurant = {
      name,
      email,
      phone,
      url,
      description,
      address,
    };
    if (image) {
      const restaurantResult = await Restaurant.findById(id).exec();
      fs.unlinkSync(`public/${restaurantResult?.image}`);
      restaurant.image = image;
    }
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, restaurant, {
      new: true,
    }).exec();

    transactionResult = updatedRestaurant.toObject();
  });

  return transactionResult;
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
