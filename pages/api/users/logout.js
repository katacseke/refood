import nextConnect from 'next-connect';

const handler = nextConnect();

handler.post(async (req, res) => {
  res.setHeader(
    'Set-Cookie',
    'access_token=deleted; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;  HttpOnly'
  );
  res.status(204).send();
});

export default handler;
