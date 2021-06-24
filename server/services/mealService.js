import fs from 'fs';
import connectDb from '@server/db';
import Meal from '@server/models/meal';
import NotFoundError from './errors/NotFoundError';
import restaurantService from './restaurantService';

/**
 * Get meal by id.
 *
 * @param {string} id
 * @returns {Object} The Meal instance.
 *
 * @throws {NotFoundError} Throws error if the meal was not found.
 */
const getMealById = async (id) => {
  await connectDb();

  const meal = await Meal.findOneWithDeleted({ _id: id }).exec();

  if (!meal) {
    throw new NotFoundError('Az étel nem található.');
  }

  return meal.toObject();
};

/**
 * Get meals that match certain filters.
 *
 * @param {Object} filters Object containing different filters.
 * @returns {Array<Object>} Returns list of all meals that match the criteria.
 *
 */
const getMeals = async (filters = {}) => {
  await connectDb();

  const mongoFilters = {};

  if (filters.donatable === 'true') {
    mongoFilters.donatable = true;
  }

  if (filters.dailyMenu === 'true') {
    mongoFilters.dailyMenu = true;
  }

  if (filters.restaurantId && filters.restaurantId !== '') {
    mongoFilters.restaurantId = filters.restaurantId;
  }

  if (filters.startTime) {
    mongoFilters.endTime = { $gte: filters.startTime };
  }

  if (filters.endTime) {
    mongoFilters.startTime = { $lte: filters.endTime };
  }

  if (filters.minPortionNumber) {
    mongoFilters.portionNumber = { $gte: filters.minPortionNumber };
  }

  let meals;
  if (filters.name && filters.name !== '') {
    mongoFilters.$text = { $search: filters.name };

    meals = await Meal.find(mongoFilters, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .exec();
  } else {
    meals = await Meal.find(mongoFilters).exec();
  }

  return meals.map((meal) => meal.toObject());
};

/**
 * Get currently available meals from a certain restaurant.
 *
 * @param {String} id The id of the restaurant.
 * @returns {Array<Object>} Returns list of meals that fit the criteria.
 */
const getMealsByRestaurant = async (id, filters = {}) => {
  const meals = await getMeals({ ...filters, restaurantId: id });

  return meals;
};

/**
 * Get all the meals that are currently available.
 *
 * @returns {Array<Object>} Returns list of meals that fit the criteria.
 */
const getCurrentMeals = async () => {
  const meals = await getMeals({ startTime: Date.now(), endTime: Date.now() });

  return meals;
};

/**
 * Insert meal.
 *
 * @param {Object} meal
 * @returns {Object} Returns the inserted Meal instance.
 *
 * @throws {Error} Throws error if the insertion failed.
 */
const createMeal = async (meal) => {
  await connectDb();

  const restaurant = await restaurantService.getRestaurantById(meal.restaurantId);

  const savedMeal = await Meal.create({
    ...meal,
    restaurantName: restaurant.name,
  });

  if (!savedMeal) {
    throw new Error('Nem sikerült létrehozni az ételt.');
  }

  return savedMeal.toObject();
};

/**
 * Update meal.
 *
 * @param {Object} meal
 * @param {String} id
 * @returns {Object} Returns the updated meal.
 *
 * @throws {Error} Throws error if the update failed.
 */
const updateMeal = async (id, mealData) => {
  await connectDb();

  const { image } = mealData;
  const meal = { ...mealData };
  delete meal.image;

  if (image) {
    const mealResult = await Meal.findById(id).exec();

    if (fs.existsSync(`public/${mealResult?.image}`)) {
      fs.unlinkSync(`public/${mealResult?.image}`);
    }
    meal.image = image;
  }

  const updatedMeal = await Meal.findByIdAndUpdate(id, meal, { new: true }).exec();

  if (!updatedMeal) {
    throw new Error('Nem sikerült frissíteni az adatokat.');
  }
  return updatedMeal.toObject();
};

/**
 * Delete meal.
 *
 * @param {String} id
 */
const deleteMeal = async (id) => {
  await connectDb();

  await Meal.deleteById(id).exec();
};

export default {
  getMealById,
  getMeals,
  getMealsByRestaurant,
  getCurrentMeals,
  createMeal,
  updateMeal,
  deleteMeal,
};
