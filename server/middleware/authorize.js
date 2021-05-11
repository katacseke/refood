import { orderService, userService } from '@server/services';

// checks if a user has a certain role
export const hasRole = (role) => (user) => user.role === role;

// checks if the user matches the one from the request
export const isSelf = () => (user, req) => user.id === req.query.id;

// checks if the user's restaurant matches the one from the request
export const isRestaurantOwner = () => (user, req) => user.restaurantId === req.query.id;

// checks if the user's restaurant matches the restaurant of the order from the request
export const isOrderRestaurantOwner = () => async (user, req) => {
  const orderResult = await orderService.getOrderById(req.query.orderId);

  return user.restaurantId === orderResult?.restaurant.toString();
};

/**
 * Authorizes the user with different conditions.
 * If none of the conditions is met, it responds with 403.
 * If no conditions are supplied, or at least one of the conditions is met,
 * and the token is valid, it passes through the request to the next handler.
 *
 * @param {...function} conditions Functions checking if the user matches certain criteria
 */
const authorize = (...conditions) => async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.status(401).json({ error: 'Ehhez a tevékenységhez bejelentkezés szükséges!' });
    return;
  }

  const userResult = userService.verifyToken(token);

  // checks wether the user matches at least one of the conditions
  const results = await Promise.all(conditions.map((condition) => condition(userResult, req)));

  if (conditions.length === 0 || results.includes(true)) {
    req.user = userResult;
    delete req.user.exp;
    delete req.user.iat;

    next();
    return;
  }

  res.status(403).json({ error: 'Ez a művelet nem engedélyezett.' });
};

export default authorize;
