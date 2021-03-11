import nextConnect from 'next-connect';
import validateResource from '../../../server/middleware/validateResource';
import { restaurantService } from '../../../server/services';
import restaurantCreationSchema from '../../../server/validation/restaurantCreationSchema';

const validation = nextConnect().post(
  '/api/restaurants',
  validateResource(restaurantCreationSchema)
);

const handler = nextConnect().use(validation);

handler.get(async (req, res) => {
  const restaurants = await restaurantService.getRestaurants();

  if (!restaurants.success) {
    res.status(500).json({ error: restaurants.error });
    return;
  }

  res.status(200).json(restaurants.data);
});

handler.post(async (req, res) => {
  const restaurant = await restaurantService.createRestaurant(req.body);

  if (!restaurant.success) {
    res.status(500).json({ error: restaurant.error });
    return;
  }

  res.status(201).json(restaurant.data);
});

export default handler;
