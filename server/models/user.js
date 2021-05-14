import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
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
});

orderSchema.set('timestamps', true);
orderSchema.set('id', true);
orderSchema.set('toObject', { getters: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
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
  orders: { type: [orderSchema], default: [] },
});

userSchema.set('toObject', { getters: true });
userSchema.set('autoIndex', true);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
