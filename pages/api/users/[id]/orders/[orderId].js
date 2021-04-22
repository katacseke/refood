import nextConnect from 'next-connect';
import { validateResource } from '../../../../../server/middleware';
import authorize, { hasRole, isSelf } from '../../../../../server/middleware/authorize';
import { orderService } from '../../../../../server/services';
import orderUpdateByUserSchema from '../../../../../validation/orderUpdateByUserSchema';

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
  const orders = await orderService.cancelOrder(req.query.id, req.query.orderId);

  if (!orders.success) {
    res.status(422).json({ general: { message: orders.error } });
    return;
  }

  res.status(200).json(orders.data);
});

export default handler;
