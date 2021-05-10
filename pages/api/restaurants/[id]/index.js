import nextConnect from 'next-connect';
import authorize, { isRestaurantOwner } from '@middleware/authorize';
import { imageUpload, formDataParser, validateResource } from '@server/middleware';
import { restaurantService } from '@server/services';
import restaurantUpdateSchema from '@validation/restaurantUpdateSchema';

const onUploadError = (err, req, res) => {
  res.status(422).json({ error: err.message });
};

const imageUploadMiddleware = nextConnect({ onError: onUploadError })
  .patch('/api/restaurants/:id', imageUpload('image'))
  .patch('/api/restaurants/:id', formDataParser);

const authorization = nextConnect().patch('/api/restaurants/:id', authorize(isRestaurantOwner()));

const validation = nextConnect().patch(
  '/api/restaurants/:id',
  validateResource(restaurantUpdateSchema)
);

const handler = nextConnect().use(authorization).use(imageUploadMiddleware).use(validation);

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

  const updatedRestaurant = await restaurantService.updateRestaurant(id, {
    ...req.body,
    image: req.file?.path,
  });

  if (!updatedRestaurant.success) {
    res.status(500).json({ general: { message: updatedRestaurant.error } });
    return;
  }

  res.status(200).json(updatedRestaurant.data);
});

export default handler;

// turn off Body Parser
export const config = {
  api: {
    bodyParser: false,
  },
};
