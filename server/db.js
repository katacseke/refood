import mongoose from 'mongoose';
import '@server/models';

export default async () => {
  if (mongoose.connections[0].readyState) {
    // current db connection
    return mongoose.connections[0];
  }

  try {
    // new db connection
    return await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
  } catch (err) {
    console.log(err);
  }

  return null;
};
