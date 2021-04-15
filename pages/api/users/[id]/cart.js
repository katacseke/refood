import nextConnect from 'next-connect';
import { cartService } from '../../../../server/services';
import validateResource from '../../../../server/middleware/validateResource';
import authorize, { hasRole, isSelf } from '../../../../server/middleware/authorize';
import cartItemSchema from '../../../../validation/cartItemSchema';

const authorization = nextConnect()
  .get('/api/users/:id/cart', authorize(hasRole('admin'), isSelf()))
  .patch('/api/users/:id/cart', authorize(hasRole('admin'), isSelf()))
  .post('/api/users/:id/cart', authorize(hasRole('admin'), isSelf()));
const validation = nextConnect()
  .patch('/api/users/:id/cart', validateResource(cartItemSchema))
  .post('/api/users/:id/cart', validateResource(cartItemSchema));

const handler = nextConnect().use(authorization).use(validation);

handler.get(async (req, res) => {
  const cart = await cartService.getCart(req.query.id);

  if (!cart.success) {
    res.status(404).json({ error: cart.error });
    return;
  }

  res.status(200).json(cart.data);
});

handler.patch(async (req, res) => {
  const updatedCart = await cartService.upsertCartItem(req.query.id, req.body, 'set');

  if (!updatedCart.success) {
    res.status(500).json({ general: { message: updatedCart.error } });
    return;
  }

  res.status(200).json(updatedCart.data);
});

handler.post(async (req, res) => {
  const cart = await cartService.upsertCartItem(req.query.id, req.body, 'add');

  if (!cart.success) {
    res.status(500).json({ general: { message: cart.error } });
    return;
  }

  res.status(200).json(cart.data);
});

export default handler;
