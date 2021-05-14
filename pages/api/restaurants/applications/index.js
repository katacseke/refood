import nextConnect from 'next-connect';
import applicationService from '@services/applicationService';
import { handleErrors, validateResource } from '@server/middleware';
import authorize, { hasRole } from '@middleware/authorize';
import restaurantApplicationSchema from '@validation/restaurantApplicationSchema';

const validation = nextConnect().post(
  '/api/restaurants/applications',
  validateResource(restaurantApplicationSchema)
);
const authorization = nextConnect().get(
  '/api/restaurants/applications',
  authorize(hasRole('admin'))
);

const handler = nextConnect({ onError: handleErrors }).use(authorization).use(validation);

handler.get(async (req, res) => {
  const applications = await applicationService.getApplications();

  res.status(200).json(applications);
});

handler.post(async (req, res) => {
  const application = await applicationService.createApplication(req.body);

  res.status(201).json(application);
});

export default handler;
