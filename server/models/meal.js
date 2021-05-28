import mongoose from 'mongoose';
import mongooseDlete from 'mongoose-delete';

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
  image: String,
});

mealSchema.set('toObject', { getters: true });
mealSchema.plugin(mongooseDlete, { deletedAt: true, overrideMethods: true });
mealSchema.index(
  { name: 'text', tags: 'text' },
  { name: 'text_search_index', weights: { name: 2, tags: 1 }, default_language: 'hu' }
);

const Meal = mongoose.models.Meal || mongoose.model('Meal', mealSchema);
export default Meal;
