import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name: String,
  portionNumber: Number,
  restaurantId: String,
  startTime: Date,
  endTime: Date,
  price: Number,
  donatable: Boolean,
  dailyMenu: Boolean,
  tags: [String],
});

mealSchema.set('toObject', { getters: true });
mealSchema.index(
  { name: 'text', tags: 'text' },
  { name: 'text_search_index', weights: { name: 2, tags: 1 }, default_language: 'hu' }
);

mongoose.models = {};

const Meal = mongoose.model('Meal', mealSchema);
export default Meal;
