// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connect } from '../../server/db/mongodb';

export default async (req, res) => {
  const { db } = await connect();

  const data = await db.collection('sample').find({}).toArray();
  res.status(200).json({ data });
};
