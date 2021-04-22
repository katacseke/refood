import nextConnect from 'next-connect';
import { orderService } from '../../../../../server/services';
import authorize, { hasRole, isRestaurantOwner } from '../../../../../server/middleware/authorize';

const authorization = nextConnect().get(
  '/api/restaurants/:id/orders',
  authorize(hasRole('admin'), isRestaurantOwner())
);

const handler = nextConnect().use(authorization);

handler.get(async (req, res) => {
  const orders = await orderService.getOrdersByRestaurant(req.query.id);

  if (!orders.success) {
    res.status(404).json({ error: orders.error });
    return;
  }

  res.status(200).json(orders.data);
});
