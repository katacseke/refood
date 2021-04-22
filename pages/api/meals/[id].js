import nextConnect from 'next-connect';
import { mealService } from '../../../server/services';

const handler = nextConnect();

handler.get(async (req, res) => {
  const meal = await mealService.getMealById(req.query.id);

  if (!meal.success) {
    res.status(404).json({ error: meal.error });
    return;
  }

  res.status(200).json(meal.data);
});

export default handler;
