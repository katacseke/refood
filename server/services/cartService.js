import { ValidationError } from 'yup';
import { User } from '../models';
import mealService from './mealService';
import connectDb from '../db';

/**
 * Get cart by user id.
 *
 * @param {String} userId Id of the current user.
 * @returns {Object} Cart containing meal objects.
 *
 * @throws {Error} Throws Error when cart cannot be reached.
 */
const getCart = async (userId) => {
  await connectDb();

  const { cart } = await User.findById(userId)
    .populate({ path: 'cart.items.meal', model: 'Meal' })
    .populate({ path: 'cart.restaurant', model: 'Restaurant' })
    .exec();

  if (!cart) {
    throw new Error('A kosár nem érhető el');
  }
  return cart.toObject();
};

/**
 * Update or insert an item of a cart that belongs to a certain user.
 *
 * @param {String} userId Id of the user the cart belongs to.
 * @param {Object} newItem The cart item to update.
 * @param {String} quantityStrategy 'set' or 'add'. In case of 'set',
 *   the quantity will be set to the specified value,
 *   otherwise the quantity will be incremented by the specified value.
 * @returns Object containing updated cart.
 *
 * @throws {Error} Throws Error when action fails.
 * @throws {ValidationError} Throws ValidationError when cart items do not match criteria.
 */
const upsertCartItem = async (userId, newItem, quantityStrategy) => {
  await connectDb();

  const user = await User.findById(userId).select('cart').exec();

  const { cart } = user;
  if (!cart) {
    throw new Error('Nem sikerült elérni a kosarat.');
  }

  const mealResult = await mealService.getMealById(newItem.meal);

  if (cart.restaurant && cart.restaurant.toString() !== mealResult.restaurantId) {
    throw new ValidationError('Egyszerre csak egy vendéglőtől rendelhetők termékek!');
  }

  const cartItem = cart.items.find((item) => item.meal.toString() === newItem.meal);

  if (cartItem) {
    cartItem.quantity =
      quantityStrategy === 'set' ? newItem.quantity : cartItem.quantity + newItem.quantity;

    if (cartItem.quantity === 0) {
      cart.items.remove(cartItem);
    }
  } else if (newItem.quantity > 0) {
    cart.restaurant = mealResult.restaurantId;
    cart.items.push(newItem);
  }

  if (cart.items.length === 0) {
    cart.restaurant = undefined;
  }

  await user.save();

  const updatedCart = await cart
    .populate({ path: 'items.meal', model: 'Meal' })
    .populate({ path: 'restaurant', model: 'Restaurant' })
    .execPopulate();

  return updatedCart.toObject();
};

/**
 * Delete cart content for user.
 *
 * @param {String} userId Id of current user.
 *
 * @throws {Error} Throws Error when cart cannot be reached.
 */
const deleteCartContent = async (userId) => {
  await connectDb();

  const user = await User.findById(userId).select('cart').exec();

  const { cart } = user;
  if (!cart) {
    throw new Error('Nem sikerült elérni a kosarat.');
  }

  cart.restaurant = undefined;
  cart.items = [];
  user.save();
};

export default {
  getCart,
  upsertCartItem,
  deleteCartContent,
};
