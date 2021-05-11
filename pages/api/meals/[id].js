import nextConnect from 'next-connect';
import mealService from '@services/mealService';
import handleErrors from '@middleware/handleErrors';

const handler = nextConnect({ onError: handleErrors });

handler.get(async (req, res) => {
  const meal = await mealService.getMealById(req.query.id);

  res.status(200).json(meal);
});

export default handler;
