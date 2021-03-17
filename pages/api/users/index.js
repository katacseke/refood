import nextConnect from 'next-connect';
import { userService } from '../../../server/services';
import registrationSchema from '../../../validation/registrationSchema';
import validateResource from '../../../server/middleware/validateResource';

const validation = nextConnect().post('/api/users', validateResource(registrationSchema));

const handler = nextConnect().use(validation);

handler.get(async (req, res) => {
  const users = await userService.getUsers();

  if (!users.success) {
    res.status(500).json({ error: users.error });
    return;
  }

  res.status(200).json(users.data);
});

handler.post(async (req, res) => {
  const { name, email, password } = req.body;

  const findUser = await userService.getUserByEmail(email);
  if (findUser.success) {
    res.status(400).json({ error: 'User with this email already exists!' });
    return;
  }

  const user = await userService.createUser({ name, email, password });
  if (user.success) {
    const token = userService.createToken(user.data);

    res.setHeader('Set-Cookie', `access_token=${token}; Max-Age=${14 * 24 * 60 * 60}; HttpOnly`);
    res.status(201).json(user.data);

    return;
  }
  res.status(500).json({ error: user.error });
});

export default handler;
