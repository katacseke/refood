import nextConnect from 'next-connect';
import orderService from '@services/orderService';
import authorize, { hasRole, isSelf } from '@middleware/authorize';
import { validateResource } from '@server/middleware';
import orderUpdateByUserSchema from '@validation/orderUpdateByUserSchema';

const authorization = nextConnect().patch(
  '/api/users/:id/orders/:orderId',
  authorize(hasRole('admin'), isSelf())
);

const validation = nextConnect().patch(
  '/api/users/:id/orders/:orderId',
  validateResource(orderUpdateByUserSchema)
);

const handler = nextConnect().use(authorization).use(validation);

handler.patch(async (req, res) => {
  const orders = await orderService.cancelOrder(req.query.orderId);

  res.status(200).json(orders);
});

export default handler;
