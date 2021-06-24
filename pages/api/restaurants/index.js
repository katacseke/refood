import nextConnect from 'next-connect';
import restaurantService from '@services/restaurantService';
import { handleErrors } from '@server/middleware';

const handler = nextConnect({ onError: handleErrors });

handler.get(async (req, res) => {
  const restaurants = await restaurantService.getRestaurants();

  res.status(200).json(restaurants);
});

export default handler;
