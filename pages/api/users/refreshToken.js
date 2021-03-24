import nextConnect from 'next-connect';
import authorize, { authenticated } from '../../../server/middleware/authorize';
import { userService } from '../../../server/services';

const authorization = nextConnect().post('/api/users/refreshToken', authorize(authenticated()));
const handler = nextConnect().use(authorization);

handler.post(async (req, res) => {
  const token = userService.createToken(req.user);

  res.setHeader('Set-Cookie', `access_token=${token}; Max-Age=${60 * 60}; HttpOnly`);
  res.status(200).json(req.user);
});

export default handler;
