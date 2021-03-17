import nextConnect from 'next-connect';
import { userService } from '../../../server/services';

const handler = nextConnect();

handler.post(async (req, res) => {
  const { email, password } = req.body;

  const match = await userService.checkCredentials(email, password);
  if (match.success) {
    const token = userService.createToken(match.data);

    res.setHeader('Set-Cookie', `access_token=${token}; Max-Age=${14 * 24 * 60 * 60}; HttpOnly`);
    res.status(200).json();
    return;
  }

  res.status(401).json({ error: match.error });
});

export default handler;
