import nextConnect from 'next-connect';
import userService from '@services/userService';
import authorize from '@middleware/authorize';

const authorization = nextConnect().post('/api/users/refreshToken', authorize());

const handler = nextConnect().use(authorization);

handler.post(async (req, res) => {
  const token = userService.createToken(req.user);

  res.setHeader('Set-Cookie', `access_token=${token}; Path=/; Max-Age=${60 * 60}; HttpOnly`);
  res.status(200).json(req.user);
});

export default handler;
