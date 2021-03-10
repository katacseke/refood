import nextConnect from 'next-connect';
import validateResource from '../../../server/middleware/validateResource';
import { mealService } from '../../../server/services';
import mealCreationSchema from '../../../server/validation/mealCreationSchema';

const validation = nextConnect().post('/api/meals', validateResource(mealCreationSchema));

const handler = nextConnect().use(validation);

handler.get(async (req, res) => {
  const meal = await mealService.getMealById(req.params.id);

  if (!meal.success) {
    res.status(404).json({ error: meal.error });
  }

  res.status(200).json(meal);
});

export default handler;
