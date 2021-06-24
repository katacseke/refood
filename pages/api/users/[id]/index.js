import nextConnect from 'next-connect';
import userService from '@services/userService';
import { handleErrors, validateResource } from '@server/middleware';
import authorize, { hasRole, isSelf } from '@middleware/authorize';
import userUpdateSchema from '@validation/userUpdateSchema';

const authorization = nextConnect()
  .get('/api/users/:id', authorize(hasRole('admin'), isSelf()))
  .delete('/api/users/:id', authorize(hasRole('admin'), isSelf()))
  .patch('/api/users/:id', authorize(isSelf()));

const validation = nextConnect().patch('/api/users/:id', validateResource(userUpdateSchema));

const handler = nextConnect({ onError: handleErrors }).use(authorization).use(validation);

handler.get(async (req, res) => {
  const user = await userService.getUserById(req.query.id);

  res.status(200).json(user);
});

handler.delete(async (req, res) => {
  await userService.deleteUser(req.query.id);

  res.status(204).send();
});

handler.patch(async (req, res) => {
  const updatedUser = await userService.updateUser(req.query.id, req.body);
  res.status(200).json(updatedUser);
});

export default handler;
