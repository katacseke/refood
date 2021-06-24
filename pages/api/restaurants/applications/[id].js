import nextConnect from 'next-connect';
import applicationService from '@services/applicationService';
import authorize, { hasRole } from '@middleware/authorize';
import { handleErrors } from '@server/middleware';

const authorization = nextConnect()
  .get('/api/restaurants/applications/:id', authorize(hasRole('admin')))
  .patch('/api/restaurants/applications/:id', authorize(hasRole('admin')));

const handler = nextConnect({ onError: handleErrors }).use(authorization);

handler.get(async (req, res) => {
  const application = await applicationService.getApplicationById(req.query.id);

  res.status(200).json(application);
});

handler.patch(async (req, res) => {
  const updatedApplication = await applicationService.updateApplicationStatus(
    req.query.id,
    req.body.status
  );

  res.status(200).json(updatedApplication);
});

export default handler;
