import nextConnect from 'next-connect';
import validateResource from '../../../../server/middleware/validateResource';
import { restaurantService, applicationService } from '../../../../server/services';
import restaurantCreationSchema from '../../../../validation/restaurantCreationSchema';

const validation = nextConnect().post(
  '/api/restaurants/registration/:token',
  validateResource(restaurantCreationSchema)
);

const handler = nextConnect().use(validation);

handler.post(async (req, res) => {
  const findApplication = await applicationService.getAcceptedApplicationByToken(req.query.token);
  if (!findApplication.success) {
    res.status(400).json({ email: { message: 'The application token is not valid.' } });
    return;
  }

  const restaurant = await restaurantService.createRestaurant(req.body, findApplication.data);

  if (!restaurant.success) {
    res.status(500).json({ error: restaurant.error });
    return;
  }

  res.status(201).json(restaurant.data);
});

export default handler;
