import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  restaurantId: String,
  cart: {
    type: [
      {
        meal: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Meal',
        },
        quantity: Number,
      },
    ],
    default: [],
  },
});

userSchema.set('toObject', { getters: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
