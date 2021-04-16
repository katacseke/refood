import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  restaurantId: String,
  cart: {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
    items: {
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
  },
  orders: {
    type: [
      {
        status: String,
        restaurant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Restaurant',
        },
        items: {
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
      },
    ],
    default: [],
  },
});

userSchema.set('toObject', { getters: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
