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
 * Get all meals.
 * @returns {Array} Array of all meals.
 */
const getMeals = async () => {
  await connectDb();

  const meals = await Meal.find({}).exec();
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
  createMeal,
  updateMeal,
};
