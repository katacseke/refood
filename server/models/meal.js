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

mongoose.models = {};

const Meal = mongoose.model('Meal', mealSchema);
export default Meal;
