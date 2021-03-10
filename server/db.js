import mongoose from 'mongoose';

export default async () => {
  if (mongoose.connections[0].readyState) {
    // current db connection
    return;
  }

  try {
    // new db connection
    await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
  } catch (err) {
    console.log(err);
  }
};
