import nextConnect from 'next-connect';
import authorize, { hasRole } from '../../../../server/middleware/authorize';
import { restaurantService } from '../../../../server/services';

const getAuthorization = nextConnect().get(
  '/api/restaurants/applications/:id',
  authorize(hasRole('admin'))
);
const patchAuthorization = nextConnect().get(
  '/api/restaurants/applications/:id',
  authorize(hasRole('admin'))
);

const handler = nextConnect().use(getAuthorization).use(patchAuthorization);

handler.get(async (req, res) => {
  const application = await restaurantService.getApplicationById(req.query.id);

  if (!application.success) {
    res.status(404).json({ error: application.error });
    return;
  }

  res.status(200).json(application.data);
});

handler.patch(async (req, res) => {
  const { id } = req.query;

  const updatedApplication = await restaurantService.updateApplicationStatus(id, req.body.status);

  if (!updatedApplication.success) {
    res.status(500).json({ error: updatedApplication.error });
    return;
  }

  res.status(200).json(updatedApplication.data);
});

export default handler;
