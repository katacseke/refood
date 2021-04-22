import nextConnect from 'next-connect';
import { restaurantService } from '../../../../server/services';
import authorize, { isRestaurantOwner } from '../../../../server/middleware/authorize';
import validateResource from '../../../../server/middleware/validateResource';
import restaurantUpdateSchema from '../../../../validation/restaurantUpdateSchema';

const authorization = nextConnect().patch('/api/restaurants/:id', authorize(isRestaurantOwner()));
const validation = nextConnect().patch(
  '/api/restaurants/:id',
  validateResource(restaurantUpdateSchema)
);

const handler = nextConnect().use(authorization).use(validation);

handler.get(async (req, res) => {
  const restaurant = await restaurantService.getRestaurantById(req.query.id);

  if (!restaurant.success) {
    res.status(404).json({ error: restaurant.error });
    return;
  }

  res.status(200).json(restaurant.data);
});

handler.patch(async (req, res) => {
  const { id } = req.query;

  const updatedRestaurant = await restaurantService.updateRestaurant(id, req.body);

  if (!updatedRestaurant.success) {
    res.status(500).json({ general: { message: updatedRestaurant.error } });
    return;
  }

  res.status(200).json(updatedRestaurant.data);
});

export default handler;
