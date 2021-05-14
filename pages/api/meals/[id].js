import nextConnect from 'next-connect';
import mealService from '@services/mealService';
import handleErrors from '@middleware/handleErrors';
import { authorize } from '@server/middleware';
import { isMealOwner } from '@server/middleware/authorize';

const authorization = nextConnect().get('/api/meals/:id', authorize(isMealOwner));

const handler = nextConnect({ onError: handleErrors }).use(authorization);

handler.get(async (req, res) => {
  const meal = await mealService.getMealById(req.query.id);

  res.status(200).json(meal);
});

handler.delete(async (req, res) => {
  await mealService.deleteMeal(req.query.id);

  res.status(204).send();
});

export default handler;
