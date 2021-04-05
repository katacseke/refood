import { Meal } from '../models';
import connectDb from '../db';

/**
 * Get meal by id.
 * @param {string} id
 * @returns {
 *   success: Boolean,
 *   ?meal: Meal,
 *   ?error: String,
 * } Returns an object containing the Meal instance or an error message
 */
const getMealById = async (id) => {
  await connectDb();

  const meal = await Meal.findById(id).exec();

  if (!meal) {
    return {
      success: false,
      error: 'Meal not found',
    };
  }

  return {
    success: true,
    data: meal,
  };
};

/**
 * Get meals that match certain filters.
 * @param {Object} filters Object containing different filters
 * @returns {Array} Array of all meals that match the criteria.
 */
const getMeals = async (filters = {}) => {
  await connectDb();

  const mongoFilters = {};

  if (filters.name) {
    const regex = new RegExp(filters.name, 'i');
    mongoFilters.name = { $regex: regex };
  }

  if (filters.donatable === 'true') {
    mongoFilters.donatable = true;
  }

  if (filters.dailyMenu === 'true') {
    mongoFilters.dailyMenu = true;
  }

  if (filters.startTime) {
    mongoFilters.endTime = { $gte: filters.startTime };
  }

  if (filters.endTime) {
    mongoFilters.startTime = { $lte: filters.endTime };
  }

  const meals = await Meal.find(mongoFilters).exec();
  return { success: true, data: meals };
};

/**
 * Get meals with a specific name
 * @returns {Array} Array of all meals.
 */
const getMealsWithName = async (text) => {
  await connectDb();

  const regex = new RegExp(text, 'i');
  const meals = await Meal.find({ name: { $regex: regex } }).exec();

  return { success: true, data: meals };
};

/**
 * Get meals from a certain restaurant, at a certain time
 * @returns {Array} Array of meals that fit the criteria.
 */
const getCurrentMealsByRestaurant = async (id) => {
  await connectDb();

  const meals = await Meal.find({
    restaurantId: id,
    startTime: { $lte: Date.now() },
    endTime: { $gte: Date.now() },
  }).exec();

  return { success: true, data: meals };
};

/**
 * Get meals that are available now
 * @returns {Array} Array of meals that fit the criteria.
 */
const getCurrentMeals = async () => {
  await connectDb();

  const meals = await Meal.find({
    startTime: { $lte: Date.now() },
    endTime: { $gte: Date.now() },
  }).exec();

  return { success: true, data: meals };
};

/**
 * Insert meal.
 * @param {Meal} meal
 * @returns {Object} Returns an object with error message or success
 */
const createMeal = async (meal) => {
  await connectDb();

  const result = await Meal.create(meal);

  return result
    ? { success: true, data: meal }
    : { success: false, error: 'Unable to insert data.' };
};

/**
 * Update meal.
 * @param {Meal} meal
 * @param {String} id
 * @returns {Object} Returns an object with error message or success
 */
const updateMeal = async (id, meal) => {
  await connectDb();

  const result = await Meal.findByIdAndUpdate(id, meal, { new: true });

  return result
    ? { success: true, data: meal }
    : { success: false, error: 'Unable to update data.' };
};

export default {
  getMealById,
  getMeals,
  getCurrentMealsByRestaurant,
  getMealsWithName,
  getCurrentMeals,
  createMeal,
  updateMeal,
};
