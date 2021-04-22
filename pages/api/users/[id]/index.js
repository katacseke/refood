import nextConnect from 'next-connect';
import { userService } from '../../../../server/services';
import authorize, { hasRole, isSelf } from '../../../../server/middleware/authorize';

const authorization = nextConnect()
  .get('/api/users/:id', authorize(hasRole('admin'), isSelf()))
  .delete('/api/users/:id', authorize(hasRole('admin'), isSelf()))
  .patch('/api/users/:id', authorize(isSelf()));

const handler = nextConnect().use(authorization);

handler.get(async (req, res) => {
  const user = await userService.getUserById(req.query.id);

  if (!user.success) {
    res.status(404).json({ error: user.error });
    return;
  }

  res.status(200).json(user.data);
});

handler.delete(async (req, res) => {
  const result = await userService.deleteUser(req.query.id);

  if (!result.success) {
    res.status(404).json({ general: { message: result.error } });
    return;
  }

  res.status(200).json(result.data);
});

handler.patch(async (req, res) => {
  const { id } = req.query;

  const updatedUser = await userService.updateUser(id, req.body);

  if (!updatedUser.success) {
    res.status(500).json({ general: { message: updatedUser.error } });
    return;
  }

  res.status(200).json(updatedUser.data);
});

export default handler;
