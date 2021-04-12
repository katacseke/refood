import nextConnect from 'next-connect';
import { cartService } from '../../../../server/services';
import authorize, { hasRole, isSelf } from '../../../../server/middleware/authorize';

const authorization = nextConnect()
  .get('/api/users/:id/cart', authorize(hasRole('admin'), isSelf()))
  .patch('/api/users/:id/cart', authorize(hasRole('admin'), isSelf()));

const handler = nextConnect().use(authorization);

handler.get(async (req, res) => {
  const cart = await cartService.getCart(req.query.id);

  if (!cart.success) {
    res.status(404).json({ error: cart.error });
    return;
  }

  res.status(200).json(cart.data);
});

handler.patch(async (req, res) => {
  const updatedCart = await cartService.updateCart(req.query.id, req.body);

  if (!updatedCart.success) {
    res.status(500).json({ general: { message: updatedCart.error } });
    return;
  }

  res.status(200).json(updatedCart.data);
});

export default handler;
