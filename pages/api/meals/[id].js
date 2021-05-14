import nextConnect from 'next-connect';
import mealService from '@services/mealService';
import { uploadImage, handleErrors, validateResource } from '@server/middleware';
import authorize, { isMealOwner } from '@server/middleware/authorize';
import mealUpdateSchema from '@validation/mealUpdateSchema';

const authorization = nextConnect()
  .get('/api/meals/:id', authorize(isMealOwner))
  .patch('/api/meals/:id', authorize(isMealOwner));
const imageUploadMiddleware = nextConnect().patch('/api/restaurants/:id', uploadImage('image'));
const validation = nextConnect().patch('/api/restaurants/:id', validateResource(mealUpdateSchema));

const handler = nextConnect({ onError: handleErrors })
  .use(authorization)
  .use(imageUploadMiddleware)
  .use(validation);

handler.get(async (req, res) => {
  const meal = await mealService.getMealById(req.query.id);

  res.status(200).json(meal);
});

handler.patch(async (req, res) => {
  const updatedMeal = await mealService.updateMeal(req.query.id, req.body);

  res.status(200).json(updatedMeal);
});

handler.delete(async (req, res) => {
  await mealService.deleteMeal(req.query.id);

  res.status(204).send();
});

export default handler;

// turn off Body Parser
export const config = {
  api: {
    bodyParser: false,
  },
};
