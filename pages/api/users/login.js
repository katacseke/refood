import nextConnect from 'next-connect';
import { userService } from '../../../server/services';

const handler = nextConnect();

handler.post(async (req, res) => {
  const { email, password } = req.body;

  const match = await userService.checkCredentials(email, password);

  if (match.success) {
    const token = userService.createToken(match.data);

    res.setHeader('Set-Cookie', `access_token=${token}; Path=/; Max-Age=${60 * 60}; HttpOnly`);
    res.status(200).json(match.data);
    return;
  }

  res.status(401).json({ general: { message: match.error } });
});

export default handler;
