import { userService } from '../services';

// checks if a user has a certain role
export const hasRole = (role) => (user) => user.data.role === role;

// checks if the user matches the one from the request
export const isSelf = () => (user, req) => user.data.id === req.query.id;

/**
 * Authorizes the user with different conditions
 * @param  {...function} conditions Functions checking if the user matches certain criteria
 * @returns
 */
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

  // checks wether the user matches all the conditions
  if (conditions.some((condition) => condition(user, req))) {
    next();
    return;
  }

  res.status(403).json({ error: 'No permission for this action' });
};

export default authorize;
