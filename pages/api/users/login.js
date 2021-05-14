import nextConnect from 'next-connect';
import userService from '@services/userService';
import handleErrors from '@middleware/handleErrors';

const handler = nextConnect({ onError: handleErrors });

handler.post(async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.checkCredentials(email, password);
  const token = await userService.createToken(user.id);

  res.setHeader('Set-Cookie', `access_token=${token}; Path=/; Max-Age=${60 * 60}; HttpOnly`);
  res.status(200).json(user);
});

export default handler;
