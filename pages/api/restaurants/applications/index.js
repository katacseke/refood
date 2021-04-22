import nextConnect from 'next-connect';
import validateResource from '../../../../server/middleware/validateResource';
import authorize, { hasRole } from '../../../../server/middleware/authorize';
import { applicationService } from '../../../../server/services';
import restaurantApplicationSchema from '../../../../validation/restaurantApplicationSchema';

const validation = nextConnect().post(
  '/api/restaurants/applications',
  validateResource(restaurantApplicationSchema)
);

const authorization = nextConnect().get(
  '/api/restaurants/applications',
  authorize(hasRole('admin'))
);

const handler = nextConnect().use(validation).use(authorization);

handler.get(async (req, res) => {
  const applications = await applicationService.getApplications();

  if (!applications.success) {
    res.status(500).json({ error: applications.error });
    return;
  }

  res.status(200).json(applications.data);
});

handler.post(async (req, res) => {
  const application = await applicationService.createApplication(req.body);

  if (!application.success) {
    res.status(500).json({ general: { message: application.error } });
    return;
  }

  res.status(201).json(application.data);
});

export default handler;
