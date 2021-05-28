import User from '@server/models/user';
import connectDb from '@server/db';
import cartService from '@server/services/cartService';
import mealService from '@server/services/mealService';
import { NotFoundError, ValidationError } from './errors';

/**
 * Get all orders belonging to a certain user, sorted desc by the updatedAt field.
 *
 * @param {String} userId The id of the user.
 * @returns {Array<Object>} Orders array containing order objects.
 *
 * @throws {NotFoundError} Throws NotFoundError when user not found.
 */
const getOrdersByUser = async (userId) => {
  await connectDb();

  const { orders } = await User.findById(userId)
    .populate({ path: 'orders.items.meal', model: 'Meal', options: { withDeleted: true } })
    .populate({ path: 'orders.restaurant', model: 'Restaurant' })
    .exec();

  if (!orders) {
    throw new NotFoundError('Nem létezik felhasználó ezzel az azonosítóval.');
  }

  return orders.map((order) => order.toObject()).sort((a, b) => b.updatedAt - a.updatedAt);
};

/**
 * Get order with id, belonging to a certain user.
 *
 * @param {String} userId Id of the user.
 * @param {String} orderId Id of the order.
 * @returns {Object} Returns the order instance.
 *
 * @throws {NotFoundError} Throws NotFoundError if the user or order is not found.
 */
const getOrderByUser = async (userId, orderId) => {
  await connectDb();

  const user = User.findOne({ _id: userId, 'orders.id': orderId })
    .populate({ path: 'orders.items.meal', model: 'Meal', options: { withDeleted: true } })
    .populate({ path: 'orders.restaurant', model: 'Restaurant' })
    .exec();

  if (!user?.orders) {
    throw new NotFoundError('Ez a rendelés nem létezik.');
  }

  return user.orders[0].toObject();
};

/**
 * Get orders that belong to a certain restaurant, sorted desc by the updatedAt field.
 *
 * @param {String} restaurantId id of the restaurant the order is from.
 * @returns {Array<Object>} Returns an array of order instances.
 */
const getOrdersByRestaurant = async (restaurantId) => {
  await connectDb();

  const users = await User.find({ 'orders.restaurant': restaurantId })
    .populate({ path: 'orders.items.meal', model: 'Meal', options: { withDeleted: true } })
    .populate({ path: 'orders.restaurant', model: 'Restaurant' })
    .exec();

  const orders = users
    .flatMap((user) =>
      user.orders.map((order) => ({
        ...order.toObject(),
        user: { name: user.name, email: user.email, phone: user.phone },
      }))
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return orders;
};

/**
 * Get order with a given id.
 *
 * @param {String} orderId Id of the order.
 * @returns {Object} Returns the order instance.
 *
 * @throws {NotFoundError} Throws NotFoundError if the order was not found.
 */
const getOrderById = async (orderId) => {
  await connectDb();

  const user = await User.findOne({ 'orders._id': orderId }).select('orders').exec();
  const order = user?.orders.id(orderId);

  if (!order) {
    throw new NotFoundError('Ez a rendelés nem létezik.');
  }

  return order.toObject();
};

/**
 * Handles order process: creates an order from the content of the cart,
 * then clears the cart and updates the portion numbers of meals.
 *
 * @param {String} userId id of the user the order belongs to
 * @returns Order object, or object containing error message.
 *
 * @throws {Error} Throws Error if insertion failed.
 * @throws {NotFoundError} Throws NotFoundError if the user associated to the
 *                         order cannot be found.
 */
const createOrder = async (userId) => {
  const connection = await connectDb();

  let transactionResult;
  await connection.transaction(
    async () => {
      // Get the necessary data
      const user = await User.findById(userId).exec();

      if (!user) {
        throw new NotFoundError('Ez a felhasználó nem létezik.');
      }

      const { orders, cart } = user;

      if (cart.items.length === 0) {
        throw new Error('A kosár üres.');
      }

      // Update meal quantities
      const populatedCart = await cart
        .populate({ path: 'items.meal', model: 'Meal', options: { withDeleted: true } })
        .execPopulate();

      const deletedItem = populatedCart.items.find((item) => item.meal.deleted === true);
      if (deletedItem) {
        throw new ValidationError(
          `A ${deletedItem.meal.name} étel már nem elérhető. Kérlek vedd ki a kosaradból.`
        );
      }

      await Promise.all(
        populatedCart.items.map(async (item) => {
          const newPortionNumber = item.meal.portionNumber - item.quantity;

          if (newPortionNumber < 0) {
            throw new Error(`Nincs elegendő adag a(z) ${item.meal.name} nevű ételből.`);
          }

          const result = await mealService.updateMeal(item.meal.id, {
            portionNumber: newPortionNumber,
          });

          if (!result) {
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
      await cartService.deleteCartContent(userId);

      transactionResult = orderContent;
    },
    { readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' } }
  );

  return transactionResult;
};

/**
 * Cancel order for user.
 *
 * @param {String} userId Id of current user.
 * @returns {Object} Returns order object.
 *
 * @throws {Error} Throws Error if insertion failed.
 * @throws {ValidationError} Throws ValidationError if the order cannot be canceled.
 * @throws {NotFoundError} Throws NotFoundError if the order cannot be found.
 */
const cancelOrder = async (orderId, newStatus = 'canceled') => {
  const connection = await connectDb();

  let transactionResult;
  await connection.transaction(async () => {
    // Get the necessary data
    const user = await User.findOne({ 'orders._id': orderId })
      .populate({ path: 'orders.items.meal', model: 'Meal', options: { withDeleted: true } })
      .select('orders')
      .exec();

    const order = user?.orders.id(orderId);

    if (!order) {
      throw new NotFoundError('Ez a rendelés nem létezik.');
    }

    // Update the order status
    if (order.status !== 'active') {
      throw new ValidationError('A rendelést már nem lehet lemondani.');
    }

    order.status = newStatus;
    await user.save();

    // Update the meal portion numbers
    await Promise.all(
      order.items.map(async (item) => {
        const result = await mealService.updateMeal(item.meal.id, {
          portionNumber: item.meal.portionNumber + item.quantity,
        });

        if (!result) {
          throw new Error('Nem sikerült visszavonni a rendelést.');
        }
      })
    );

    transactionResult = order.toObject();
  });

  return transactionResult;
};

/**
 * Changes the status of the order to finished.
 *
 * @param {String} orderId
 * @returns Returns the finished order.
 *
 * @throws {ValidationError} Throws ValidationError if the order is already finished.
 * @throws {NotFoundError} Throws NotFoundError if the order cannot be found.
 */
const finishOrder = async (orderId) => {
  await connectDb();

  const user = await User.findOne({ 'orders._id': orderId })
    .select('orders')
    .populate({ path: 'orders.items.meal', model: 'Meal', options: { withDeleted: true } })
    .exec();
  const order = user?.orders.id(orderId);

  if (!order) {
    throw new NotFoundError('Ez a rendelés nem létezik.');
  }

  if (order.status !== 'active') {
    throw new ValidationError('A rendelés már lezárult.');
  }

  const deletedItem = order.items.find((item) => item.meal.deleted === true);
  if (deletedItem) {
    throw new ValidationError(
      `A ${deletedItem.meal.name} étel már nem elérhető, ezért a rendelést nem lehet teljesíteni.`
    );
  }

  order.status = 'finished';
  await user.save();

  return order.toObject();
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
