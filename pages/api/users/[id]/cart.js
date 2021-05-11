import nextConnect from 'next-connect';
import cartService from '@services/cartService';
import { handleErrors, validateResource } from '@server/middleware';
import authorize, { hasRole, isSelf } from '@middleware/authorize';
import cartItemSchema from '@validation/cartItemSchema';

const authorization = nextConnect()
  .get('/api/users/:id/cart', authorize(hasRole('admin'), isSelf()))
  .patch('/api/users/:id/cart', authorize(hasRole('admin'), isSelf()))
  .post('/api/users/:id/cart', authorize(hasRole('admin'), isSelf()))
  .delete('/api/users/:id/cart', authorize(hasRole('admin'), isSelf()));

const validation = nextConnect()
  .patch('/api/users/:id/cart', validateResource(cartItemSchema))
  .post('/api/users/:id/cart', validateResource(cartItemSchema));

const handler = nextConnect({ onError: handleErrors }).use(authorization).use(validation);

handler.get(async (req, res) => {
  const cart = await cartService.getCart(req.query.id);

  res.status(200).json(cart);
});

handler.patch(async (req, res) => {
  const updatedCart = await cartService.upsertCartItem(req.query.id, req.body, 'set');

  res.status(200).json(updatedCart);
});

handler.post(async (req, res) => {
  const cart = await cartService.upsertCartItem(req.query.id, req.body, 'add');

  res.status(200).json(cart);
});

handler.delete(async (req, res) => {
  await cartService.deleteCartContent(req.query.id);

  res.status(204).send();
});

export default handler;
