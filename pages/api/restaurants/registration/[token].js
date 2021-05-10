import nextConnect from 'next-connect';
import { formDataParser, validateResource, imageUpload } from '@server/middleware';
import { restaurantService, applicationService } from '@server/services';
import restaurantCreationSchema from '@validation/restaurantCreationSchema';

const onUploadError = (err, req, res) => {
  res.status(422).json({ error: err.message });
};

const imageUploadMiddleware = nextConnect({ onError: onUploadError })
  .post('/api/restaurants/registration/:token', imageUpload('image'))
  .post('/api/restaurants/registration/:token', formDataParser);

const validation = nextConnect().post(
  '/api/restaurants/registration/:token',
  validateResource(restaurantCreationSchema)
);

const handler = nextConnect().use(imageUploadMiddleware).use(validation);

handler.post(async (req, res) => {
  const findApplication = await applicationService.getAcceptedApplicationByToken(req.query.token);
  if (!findApplication.success) {
    res.status(400).json({ email: { message: 'The application token is not valid.' } });
    return;
  }

  const restaurant = await restaurantService.createRestaurant(
    { ...req.body, image: req.file?.path },
    findApplication.data
  );

  if (!restaurant.success) {
    res.status(500).json({ general: { message: restaurant.error } });
    return;
  }

  res.status(201).json(restaurant.data);
});

export default handler;

// turn off Body Parser
export const config = {
  api: {
    bodyParser: false,
  },
};
