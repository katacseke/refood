import nextConnect from 'next-connect';
import mealService from '@services/mealService';
import { handleErrors, uploadImage, validateResource } from '@server/middleware';
import authorize, { hasRole } from '@middleware/authorize';
import mealCreationSchema from '@validation/mealCreationSchema';

const imageUploadMiddleware = nextConnect().post('/api/meals', uploadImage('image'));
const validation = nextConnect().post('/api/meals', validateResource(mealCreationSchema));
const authorization = nextConnect().post(
  '/api/meals',
  authorize(hasRole('restaurant'), hasRole('admin'))
);

const handler = nextConnect({ onError: handleErrors })
  .use(authorization)
  .use(imageUploadMiddleware)
  .use(validation);

handler.get(async (req, res) => {
  const meals = await mealService.getMeals();

  res.status(200).json(meals);
});

handler.post(async (req, res) => {
  const meal = await mealService.createMeal({
    ...req.body,
    restaurantId: req.user.restaurantId,
  });

  res.status(201).json(meal);
});

export default handler;

// turn off Body Parser
export const config = {
  api: {
    bodyParser: false,
  },
};
