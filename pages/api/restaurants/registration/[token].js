import nextConnect from 'next-connect';
import { validateResource, uploadImage, handleErrors } from '@server/middleware';
import { restaurantService, applicationService } from '@server/services';
import restaurantCreationSchema from '@validation/restaurantCreationSchema';

const imageUploadMiddleware = nextConnect().post(
  '/api/restaurants/registration/:token',
  uploadImage('image')
);
const validation = nextConnect().post(
  '/api/restaurants/registration/:token',
  validateResource(restaurantCreationSchema)
);

const handler = nextConnect({ onError: handleErrors }).use(imageUploadMiddleware).use(validation);

handler.post(async (req, res) => {
  const application = await applicationService.getAcceptedApplicationByToken(req.query.token);
  const restaurant = await restaurantService.createRestaurant(req.body, application);

  res.status(201).json(restaurant);
});

export default handler;

// turn off Body Parser
export const config = {
  api: {
    bodyParser: false,
  },
};
