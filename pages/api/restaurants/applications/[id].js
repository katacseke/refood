import nextConnect from 'next-connect';
import authorize, { hasRole } from '../../../../server/middleware/authorize';
import { restaurantService } from '../../../../server/services';

const authorization = nextConnect().get(
  '/api/restaurants/applications/:id',
  authorize(hasRole('admin'))
);

const handler = nextConnect().use(authorization);

handler.get(async (req, res) => {
  const application = await restaurantService.getApplicationById(req.query.id);

  if (!application.success) {
    res.status(404).json({ error: application.error });
    return;
  }

  res.status(200).json(application.data);
});

export default handler;
