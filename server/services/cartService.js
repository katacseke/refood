import { User } from '../models';
import connectDb from '../db';

/**
 * Get cart by userId
 * @param {String} userId id of current user
 * @returns {Object} Cart containing meal objects or error message and success: false
 */
const getCart = async (userId) => {
  await connectDb();

  const { cart } = await User.findById(userId)
    .populate({ path: 'cart.meal' })
    .select('cart')
    .exec();

  return { success: true, data: cart.toObject() };
};

/**
 * Update a cart item of a cart that belongs to a certain user.
 * @param {String} userId id of the user the cart belongs to
 * @param {Object} newItem the cart item to update
 * @returns Object containing updated cart on success, otherwise error message
 */
const updateCartItem = async (userId, newItem) => {
  await connectDb();

  const user = await User.findById(userId).select('cart').exec();

  const { cart } = user;
  if (!cart) {
    return { success: false, error: 'Nem sikerült elérni a kosarat' };
  }

  const meal = cart.find((item) => item.meal.toString() === newItem.meal);

  if (meal) {
    meal.quantity = newItem.quantity;

    if (meal.quantity === 0) {
      cart.remove(meal);
    }
  } else {
    cart.push(newItem);
  }

  user.save();
  return { success: true, data: cart.toObject() };
};

/**
 * Add new item to cart
 * @param {String} userId id of the user the cart belongs to
 * @param {*} newItem the cart item to add
 * @returns Object containing updated cart on success, otherwise error message
 */
const addCartItem = async (userId, newItem) => {
  await connectDb();

  const user = await User.findById(userId).select('cart').exec();

  const { cart } = user;
  if (!cart) {
    return { success: false, error: 'Nem sikerült elérni a kosarat' };
  }

  const meal = cart.find((item) => item.meal.toString() === newItem.meal);

  if (meal) {
    meal.quantity += newItem.quantity;
  } else {
    cart.push(newItem);
  }

  user.save();
  return { success: true, data: cart.toObject() };
};

export default {
  getCart,
  updateCartItem,
  addCartItem,
};
