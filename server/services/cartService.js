import { User } from '../models';
import mealService from './mealService';
import connectDb from '../db';

/**
 * Get cart by userId
 * @param {String} userId id of current user
 * @returns {Object} Cart containing meal objects or error message and success: false
 */
const getCart = async (userId) => {
  await connectDb();

  const { cart } = await User.findById(userId)
    .populate({ path: 'cart.items.meal', model: 'Meal' })
    .populate({ path: 'cart.restaurant', model: 'Restaurant' })
    .exec();

  return { success: true, data: cart.toObject() };
};

/**
 * Update or insert an item of a cart that belongs to a certain user.
 * @param {String} userId id of the user the cart belongs to
 * @param {Object} newItem the cart item to update
 * @param {String} quantityStrategy 'set' or 'add'. In case of 'set',
 *   the quantity will be set to the specified value,
 *   otherwise the quantity will be incremented by the specified value.
 * @returns Object containing updated cart on success, otherwise error message
 */
const upsertCartItem = async (userId, newItem, quantityStrategy) => {
  await connectDb();

  const user = await User.findById(userId).select('cart').exec();

  const { cart } = user;
  if (!cart) {
    return { success: false, error: 'Nem sikerült elérni a kosarat.' };
  }

  const mealResult = await mealService.getMealById(newItem.meal);
  if (!mealResult.success) {
    return mealResult;
  }

  if (cart.restaurant && cart.restaurant.toString() !== mealResult.data.restaurantId) {
    return { success: false, error: 'Egyszerre csak egy vendéglőtől rendelhetők termékek!' };
  }

  const cartItem = cart.items.find((item) => item.meal.toString() === newItem.meal);

  if (cartItem) {
    cartItem.quantity =
      quantityStrategy === 'set' ? newItem.quantity : cartItem.quantity + newItem.quantity;

    if (cartItem.quantity === 0) {
      cart.items.remove(cartItem);
    }
  } else if (newItem.quantity > 0) {
    cart.restaurant = mealResult.data.restaurantId;
    cart.items.push(newItem);
  }

  if (cart.items.length === 0) {
    cart.restaurant = undefined;
  }

  user.save();
  return { success: true, data: cart.toObject() };
};

export default {
  getCart,
  upsertCartItem,
};
