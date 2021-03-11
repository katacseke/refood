import nextConnect from 'next-connect';
import { restaurantService } from '../../../server/services';

const handler = nextConnect();

handler.get(async (req, res) => {
  const restaurant = await restaurantService.getRestaurantById(req.query.id);

  if (!restaurant.success) {
    res.status(404).json({ error: restaurant.error });
    return;
  }

  res.status(200).json(restaurant.data);
});

export default handler;
