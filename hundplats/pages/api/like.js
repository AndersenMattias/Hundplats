import Location from '../models/location';
import { dbConnect } from '../../util/db';

export default async function handler(req, res) {
  dbConnect();
  const id = req.body.location;
  if (req.method === 'POST') {
    try {
      const add = await Location.findByIdAndUpdate(
        id,
        {
          $push: {
            likes: {
              from: req.body.from,
            },
          },
        },
        { new: true }
      );

      return res.status(201).send(add);
    } catch (error) {
      res.status(500).send(error);
    }
  } else if (req.method === 'DELETE') {
    try {
      const del = await Location.findByIdAndUpdate(
        id,
        {
          $pull: {
            likes: {
              from: req.body.from,
            },
          },
        },
        { new: true }
      );

      return res.status(201).send(del);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
