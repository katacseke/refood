import nextConnect from 'next-connect';
import { orderService } from '@services';
import authorize, { hasRole, isOrderRestaurantOwner } from '@middleware/authorize';
import { validateResource } from '@middleware';
import orderUpdateByRestaurantSchema from '@validation/orderUpdateByRestaurantSchema';

const authorization = nextConnect().patch(
  '/api/restaurants/:id/orders/:orderId',
  authorize(hasRole('admin'), isOrderRestaurantOwner())
);

const validation = nextConnect().patch(
  '/api/users/:id/orders/:orderId',
  validateResource(orderUpdateByRestaurantSchema)
);

const handler = nextConnect().use(authorization).use(validation);

handler.patch(async (req, res) => {
  let orders;
  if (req.body.status === 'finished') {
    orders = await orderService.finishOrder(req.query.id, req.query.orderId);
  } else {
    orders = await orderService.cancelOrder(req.query.id, req.query.orderId, 'denied');
  }

  if (!orders.success) {
    res.status(422).json({ general: { message: orders.error } });
    return;
  }

  res.status(200).json(orders.data);
});
