import nextConnect from 'next-connect';
import orderService from '@services/orderService';
import authorize, { hasRole, isSelf } from '@middleware/authorize';
import { handleErrors } from '@server/middleware';

const authorization = nextConnect()
  .get('/api/users/:id/orders', authorize(hasRole('admin'), isSelf()))
  .post('/api/users/:id/orders', authorize(hasRole('admin'), isSelf()));

const handler = nextConnect({ onError: handleErrors }).use(authorization);

handler.get(async (req, res) => {
  const orders = await orderService.getOrdersByUser(req.query.id);

  res.status(200).json(orders);
});

handler.post(async (req, res) => {
  const orders = await orderService.createOrder(req.query.id, req.body);

  res.status(201).json(orders);
});

export default handler;
