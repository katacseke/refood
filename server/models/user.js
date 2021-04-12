import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  restaurantId: String,
});

userSchema.set('toObject', { getters: true });

mongoose.models = {};

const User = mongoose.model('User', userSchema);
export default User;
