import nextConnect from 'next-connect';
import orderService from '@services/orderService';
import authorize, { hasRole, isRestaurantOwner } from '@middleware/authorize';
import { handleErrors } from '@server/middleware';

const authorization = nextConnect().get(
  '/api/restaurants/:id/orders',
  authorize(hasRole('admin'), isRestaurantOwner())
);

const handler = nextConnect({ onError: handleErrors }).use(authorization);

handler.get(async (req, res) => {
  const orders = await orderService.getOrdersByRestaurant(req.query.id);

  res.status(200).json(orders);
});
