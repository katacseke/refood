import { User } from '../models';
import cartService from './cartService';
import connectDb from '../db';

/**
 * Get all orders by a certain user.
 * @param {String} userId id of the user
 * @returns Orders array containing order objects
 */
const getOrdersByUser = async (userId) => {
  await connectDb();

  const { orders } = await User.findById(userId)
    .populate({ path: 'orders.restaurant', model: 'Meal' })
    .populate({ path: 'orders.restaurant', model: 'Restaurant' })
    .exec();

  return { success: true, data: orders.toObject() };
};

/**
 * Get order with id by a certain user.
 * @param {String} userId Id of the user.
 * @param {String} orderId Id of the order.
 * @returns Order object or error message and success: false
 */
const getOrderByOrderId = async (userId, orderId) => {
  await connectDb();

  const { orders } = User.findById(userId, { 'orders.id': orderId })
    .populate({ path: 'orders.restaurant', model: 'Meal' })
    .populate({ path: 'orders.restaurant', model: 'Restaurant' })
    .exec();

  if (orders.length <= 0) {
    return { success: false, error: 'Nem sikerült lekérni a rendelést' };
  }

  const order = orders[0].toObject();
  return { success: true, data: order.toObject() };
};

const order = async (userId) => {
  const connection = await connectDb();

  let transactionResult;
  try {
    await connection.transaction(async () => {
      // Create the order
      const user = await User.findById(userId).exec();
      const { orders, cart } = user;

      if (!orders) {
        throw new Error('Nem sikerült elérni a rendeléseket.');
      }

      if (cart.items.length === 0) {
        throw new Error('A kosár üres.');
      }

      const orderContent = {
        ...cart.toObject(),
        status: 'active',
      };

      orders.push(orderContent);

      await user.save();

      // Delete cart content
      const cartResult = await cartService.deleteCartContent(userId);

      if (!cartResult.success) {
        throw new Error(cartResult.error);
      }

      transactionResult = orderContent;
    });

    return { success: true, data: transactionResult };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export default {
  getOrdersByUser,
  getOrderByOrderId,
  order,
};
