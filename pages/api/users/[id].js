import nextConnect from 'next-connect';
import { userService } from '../../../server/services';

const handler = nextConnect();

handler.get(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  if (!user.success) {
    res.status(404).json({ error: user.error });
    return;
  }

  res.status(200).json(user.data);
});

handler.delete(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);

  if (!result.success) {
    res.status(500).json({ error: result.error });
    return;
  }

  res.status(200).json(result.data);
});

export default handler;
