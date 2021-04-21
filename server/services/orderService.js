import { User } from '../models';
import cartService from './cartService';
import mealService from './mealService';
import connectDb from '../db';

/**
 * Get all orders by a certain user.
 * @param {String} userId id of the user
 * @returns Orders array containing order objects
 */
const getOrdersByUser = async (userId) => {
  await connectDb();

  const { orders } = await User.findById(userId)
    .populate({ path: 'orders.items.meal', model: 'Meal' })
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
    .populate({ path: 'orders.items.meal', model: 'Meal' })
    .populate({ path: 'orders.restaurant', model: 'Restaurant' })
    .exec();

  if (orders.length <= 0) {
    return { success: false, error: 'Nem sikerült lekérni a rendelést' };
  }

  const order = orders[0].toObject();
  return { success: true, data: order.toObject() };
};

/**
 * Handles order process: creates an order from the content of the cart,
 * then clears the cart and updates the portion numbers of meals.
 * @param {String} userId id of the user the order belongs to
 * @returns Order object, or object containing error message.
 */
const createOrder = async (userId) => {
  const connection = await connectDb();

  let transactionResult;
  try {
    await connection.transaction(
      async () => {
        const user = await User.findById(userId).exec();
        const { orders, cart } = user;

        if (!orders) {
          throw new Error('Nem sikerült elérni a rendeléseket.');
        }

        if (cart.items.length === 0) {
          throw new Error('A kosár üres.');
        }

        // Update meal quantities
        const populatedCart = await cart
          .populate({ path: 'items.meal', model: 'Meal' })
          .execPopulate();

        await Promise.all(
          populatedCart.items.map(async (item) => {
            const newPortionNumber = item.meal.portionNumber - item.quantity;

            if (newPortionNumber < 0) {
              throw new Error(`Nincs elegendő adag a(z) ${item.meal.name} nevű ételből.`);
            }

            const result = await mealService.updateMeal(item.meal.id, {
              portionNumber: newPortionNumber,
            });

            if (!result.success) {
              throw new Error('Nem sikerült leadni a rendelést.');
            }
          })
        );

        // Create the order
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
      },
      { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } }
    );

    return { success: true, data: transactionResult };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Cancel  order for user
 * @param {String} userId id of current user
 * @returns {Object} Order or error message and success: false
 */
const cancelOrder = async (userId, orderId) => {
  const connection = await connectDb();

  let transactionResult;
  try {
    await connection.transaction(async () => {
      const user = await User.findById(userId)
        .populate({ path: 'orders.items.meal', model: 'Meal' })
        .select('orders')
        .exec();

      const { orders } = user;
      if (!orders) {
        throw new Error('Nem sikerült visszavonni a rendelést.');
      }

      const order = orders.id(orderId);

      if (!order) {
        throw new Error('Ez a rendelés nem létezik.');
      }

      order.status = 'canceled';
      user.save();

      await Promise.all(
        order.items.map(async (item) => {
          const result = await mealService.updateMeal(item.meal.id, {
            portionNumber: item.meal.portionNumber + item.quantity,
          });

          if (!result.success) {
            throw new Error('Nem sikerült visszavonni a rendelést.');
          }
        })
      );

      order.items.transactionResult = order.toObject();
    });

    return { success: true, data: transactionResult };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export default {
  getOrdersByUser,
  getOrderByOrderId,
  cancelOrder,
  createOrder,
};
