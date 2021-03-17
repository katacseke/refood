import { userService } from '../services';

export const hasRole = (role) => (user) => user.data.role === role;

export const isSelf = () => (user, req) => user.data.id === req.query.id;

const authorize = (...conditions) => async (req, res, next) => {
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

  if (conditions.some((condition) => condition(user, req))) {
    next();
    return;
  }

  res.status(403).json({ error: 'No permission for this action' });
};

export default authorize;
