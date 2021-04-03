import mongoose from 'mongoose';

const restaurantApplicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  description: String,
  status: String,
  token: String,
});

mongoose.models = {};

const Application = mongoose.model('Application', restaurantApplicationSchema);
export default Application;
