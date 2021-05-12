import mongoose from 'mongoose';

const restaurantApplicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  description: String,
  status: String,
  token: String,
});

restaurantApplicationSchema.set('timestamps', true);
restaurantApplicationSchema.set('toObject', { getters: true });

const Application =
  mongoose.models.Application || mongoose.model('Application', restaurantApplicationSchema);
export default Application;
