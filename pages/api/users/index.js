import nextConnect from 'next-connect';
import userService from '@services/userService';
import { handleErrors, validateResource } from '@server/middleware';
import authorize, { hasRole } from '@middleware/authorize';
import registrationSchema from '@validation/registrationSchema';

const authorization = nextConnect().get('/api/users', authorize(hasRole('admin')));
const validation = nextConnect().post('/api/users', validateResource(registrationSchema));

const handler = nextConnect({ onError: handleErrors }).use(validation).use(authorization);

handler.get(async (req, res) => {
  const users = await userService.getUsers();

  res.status(200).json(users);
});

handler.post(async (req, res) => {
  const user = await userService.createUser(req.body);
  const token = await userService.createToken(user.id);

  res.setHeader('Set-Cookie', `access_token=${token}; Path=/; Max-Age=${60 * 60}; HttpOnly`);
  res.status(201).json(user);
});

export default handler;
