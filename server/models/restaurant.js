import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  url: String,
  description: String,
  address: String,
  ownerId: String,
});

mongoose.models = {};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
