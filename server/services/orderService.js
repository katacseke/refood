import { User } from '../models';
import cartService from './cartService';
import mealService from './mealService';
import connectDb from '../db';

/**
 * Get all orders belonging to a certain user.
 * @param {String} userId id of the user
 * @returns Orders array containing order objects
 */
const getOrdersByUser = async (userId) => {
  await connectDb();

  const { orders } = await User.findById(userId)
    .populate({ path: 'orders.items.meal', model: 'Meal' })
    .populate({ path: 'orders.restaurant', model: 'Restaurant' })
    .exec();

  return { success: true, data: orders.toObject().sort((a, b) => b.updatedAt - a.updatedAt) };
};

/**
 * Get order with id, belonging to a certain user.
 * @param {String} userId Id of the user.
 * @param {String} orderId Id of the order.
 * @returns Order object or error message and success: false
 */
const getOrderByUser = async (userId, orderId) => {
  await connectDb();

  const user = User.findOne({ _id: userId, 'orders.id': orderId })
    .populate({ path: 'orders.items.meal', model: 'Meal' })
    .populate({ path: 'orders.restaurant', model: 'Restaurant' })
    .exec();

  if (!user?.orders) {
    return { success: false, error: 'Ez a rendelés nem létezik.' };
  }

  const order = user.orders[0].toObject();
  return { success: true, data: order };
};

/**
 * Get orders that belong to a certain restaurant in an order from latest to oldest.
 * @param {String} restaurantId id of the restaurant the order is from.
 * @returns Orders or an object containing error message.
 */
const getOrdersByRestaurant = async (restaurantId) => {
  await connectDb();

  const users = await User.find({ 'orders.restaurant': restaurantId })
    .populate({ path: 'orders.items.meal', model: 'Meal' })
    .populate({ path: 'orders.restaurant', model: 'Restaurant' })
    .exec();

  const orders = users
    .flatMap((user) =>
      user.orders.map((order) => ({
        ...order.toObject(),
        user: { name: user.name, email: user.email },
      }))
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return { success: true, data: orders };
};

/**
 * Get order with a given id.
 * @param {String} orderId Id of the order.
 * @returns Order or object with error message.
 */
const getOrderById = async (orderId) => {
  await connectDb();

  const user = await User.findOne({ 'orders._id': orderId }).select('orders').exec();

  const order = user?.orders.id(orderId);

  if (!order) {
    return { success: false, error: 'Ez a rendelés nem létezik.' };
  }

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
        // Get the necessary data
        const user = await User.findById(userId).exec();

        if (!user) {
          throw new Error('Ez a felhasználó nem létezik.');
        }

        const { orders, cart } = user;

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
 * Cancel order for user
 * @param {String} userId id of current user
 * @returns {Object} Order or error message and success: false
 */
const cancelOrder = async (orderId, newStatus = 'canceled') => {
  const connection = await connectDb();

  let transactionResult;
  try {
    await connection.transaction(async () => {
      // Get the necessary data
      const user = await User.findOne({ 'orders._id': orderId })
        .populate({ path: 'orders.items.meal', model: 'Meal' })
        .select('orders')
        .exec();

      const order = user?.orders.id(orderId);

      if (!order) {
        throw new Error('Ez a rendelés nem létezik.');
      }

      // Update the order status
      if (order.status !== 'active') {
        throw new Error('A rendelést már nem lehet lemondani.');
      }

      order.status = newStatus;
      await user.save();

      // Update the meal portion numbers
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

      transactionResult = order.toObject();
    });

    return { success: true, data: transactionResult };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const finishOrder = async (orderId) => {
  await connectDb();

  const user = await User.findOne({ 'orders._id': orderId }).select('orders').exec();
  const order = user?.orders.id(orderId);

  if (!order) {
    return { success: false, error: 'Ez a rendelés nem létezik.' };
  }

  if (order.status !== 'active') {
    return { success: false, error: 'A rendelés már lezárult.' };
  }

  order.status = 'finished';
  await user.save();

  return { success: true, data: order.toObject() };
};

export default {
  getOrdersByUser,
  getOrderByUser,
  getOrdersByRestaurant,
  getOrderById,
  cancelOrder,
  createOrder,
  finishOrder,
};
