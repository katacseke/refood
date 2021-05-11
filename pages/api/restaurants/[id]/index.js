import nextConnect from 'next-connect';
import { restaurantService } from '@server/services';
import { handleErrors, uploadImage, validateResource } from '@server/middleware';
import authorize, { isRestaurantOwner } from '@middleware/authorize';
import restaurantUpdateSchema from '@validation/restaurantUpdateSchema';

const imageUploadMiddleware = nextConnect().patch('/api/restaurants/:id', uploadImage('image'));
const authorization = nextConnect().patch('/api/restaurants/:id', authorize(isRestaurantOwner()));
const validation = nextConnect().patch(
  '/api/restaurants/:id',
  validateResource(restaurantUpdateSchema)
);

const handler = nextConnect({ onError: handleErrors })
  .use(authorization)
  .use(imageUploadMiddleware)
  .use(validation);

handler.get(async (req, res) => {
  const restaurant = await restaurantService.getRestaurantById(req.query.id);

  res.status(200).json(restaurant);
});

handler.patch(async (req, res) => {
  const updatedRestaurant = await restaurantService.updateRestaurant(req.query.id, req.body);

  res.status(200).json(updatedRestaurant);
});

export default handler;

// turn off Body Parser
export const config = {
  api: {
    bodyParser: false,
  },
};
