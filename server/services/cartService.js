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

const updateCart = async (userId, cart) => {
  await connectDb();

  const { cart: updatedCart } = await User.findByIdAndUpdate(userId, { cart }, { new: true })
    .select('cart')
    .exec();

  if (!updatedCart) {
    return { success: false, error: 'Nem sikerült frissíteni a kosár tartalmát.' };
  }

  return { success: true, data: updatedCart.toObject() };
};

export default {
  getCart,
  updateCart,
};
