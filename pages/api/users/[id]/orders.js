import nextConnect from 'next-connect';
import { orderService } from '../../../../server/services';
import authorize, { hasRole, isSelf } from '../../../../server/middleware/authorize';

const authorization = nextConnect()
  .get('/api/users/:id/orders', authorize(hasRole('admin'), isSelf()))
  .patch('/api/users/:id/orders', authorize(hasRole('admin'), isSelf()))
  .post('/api/users/:id/orders', authorize(hasRole('admin'), isSelf()));

const handler = nextConnect().use(authorization);

handler.get(async (req, res) => {
  const orders = await orderService.getOrdersByUser(req.query.id);

  if (!orders.success) {
    res.status(404).json({ error: orders.error });
    return;
  }

  res.status(200).json(orders.data);
});

handler.post(async (req, res) => {
  const orders = await orderService.createOrder(req.query.id, req.body);

  if (!orders.success) {
    res.status(500).json({ general: { message: orders.error } });
    return;
  }

  res.status(200).json(orders.data);
});

handler.patch(async (req, res) => {
  const orders = await orderService.cancelOrder(req.query.id, req.body.orderId);

  if (!orders.success) {
    res.status(500).json({ general: { message: orders.error } });
    return;
  }

  res.status(200).json(orders.data);
});

export default handler;
