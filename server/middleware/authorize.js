import { userService } from '../services';

const authorize = (role) => async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.status(401).json({ error: 'Missing credentials.' });
    return;
  }

  const user = userService.verifyToken(token);
  if (!user.success) {
    res.status(401).json({ error: user.error });
    return;
  }

  if (user.data.role !== role) {
    res.status(403).json({ error: 'No permission for this action' });
    return;
  }

  next();
};

export default authorize;
