import nextConnect from 'next-connect';
import { restaurantService } from '../../../server/services';

const handler = nextConnect();

handler.get(async (req, res) => {
  const restaurants = await restaurantService.getRestaurants();

  if (!restaurants.success) {
    res.status(500).json({ error: restaurants.error });
    return;
  }

  res.status(200).json(restaurants.data);
});

export default handler;
