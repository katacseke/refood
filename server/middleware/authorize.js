import { orderService, userService } from '../services';

// checks if a user has a certain role
export const hasRole = (role) => (user) => user.role === role;

// checks if the user matches the one from the request
export const isSelf = () => (user, req) => user.id === req.query.id;

// checks if the user matches the one from the request
export const isRestaurantOwner = () => (user, req) => user.restaurantId === req.query.id;

export const isOrderRestaurantOwner = () => async (user, req) => {
  const { data: order } = await orderService.getOrderById(req.query.orderId);

  return user.restaurantId === order?.restaurant.toString();
};

// confirms the user is authenticated
export const authenticated = () => () => true;

/**
 * Authorizes the user with different conditions
 * @param  {...function} conditions Functions checking if the user matches certain criteria
 * @returns
 */
const authorize = (...conditions) => async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.status(401).json({ error: 'Először be kell jelentkezned.' });
    return;
  }

  const user = userService.verifyToken(token);
  if (!user.success) {
    res.status(401).json({ error: user.error });
    return;
  }

  // checks wether the user matches at least one of the conditions
  const results = await Promise.all(conditions.map((condition) => condition(user.data, req)));

  if (results.includes(true)) {
    req.user = user.data;
    delete req.user.exp;
    delete req.user.iat;

    next();
    return;
  }

  res.status(403).json({ error: 'Nincs jogosultságod ehhez.' });
};

export default authorize;
