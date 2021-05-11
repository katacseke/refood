import nextConnect from 'next-connect';
import { uploadImage, validateResource } from '@server/middleware';
import authorize, { hasRole } from '@middleware/authorize';
import mealService from '@services/mealService';
import mealCreationSchema from '@validation/mealCreationSchema';

const imageUploadMiddleware = nextConnect().post('/api/meals', uploadImage('image'));
const validation = nextConnect().post('/api/meals', validateResource(mealCreationSchema));
const authorization = nextConnect().post(
  '/api/meals',
  authorize(hasRole('restaurant'), hasRole('admin'))
);

const handler = nextConnect().use(authorization).use(imageUploadMiddleware).use(validation);

handler.get(async (req, res) => {
  const meals = await mealService.getMeals();

  if (!meals.success) {
    res.status(500).json({ error: meals.error });
    return;
  }

  res.status(200).json(meals.data);
});

handler.post(async (req, res) => {
  const meal = await mealService.createMeal({
    ...req.body,
    restaurantId: req.user.id,
  });

  if (!meal.success) {
    res.status(500).json({ general: { message: meal.error } });
    return;
  }

  res.status(201).json(meal.data);
});

export default handler;

// turn off Body Parser
export const config = {
  api: {
    bodyParser: false,
  },
};
