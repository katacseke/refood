import nextConnect from 'next-connect';
import validateResource from '../../../server/middleware/validateResource';
import authorize, { hasRole } from '../../../server/middleware/authorize';
import { mealService } from '../../../server/services';
import mealCreationSchema from '../../../validation/mealCreationSchema';

const validation = nextConnect().post('/api/meals', validateResource(mealCreationSchema));
const authorization = nextConnect().post(
  '/api/meals',
  authorize(hasRole('restaurant'), hasRole('admin'))
);

const handler = nextConnect().use(validation).use(authorization);

handler.get(async (req, res) => {
  const meals = await mealService.getMeals();

  if (!meals.success) {
    res.status(500).json({ error: meals.error });
    return;
  }

  res.status(200).json(meals.data);
});

handler.post(async (req, res) => {
  const meal = await mealService.createMeal({ ...req.body, restaurantId: req.user.id });

  if (!meal.success) {
    res.status(500).json({ error: meal.error });
    return;
  }

  res.status(201).json(meal.data);
});

export default handler;
