import User from '../../models/user';
import { dbConnect } from '../../../util/db';

export default async function handler(req, res) {
  dbConnect();

  if (req.method === 'POST') {
    try {
      const id = req.body.to;
      const add = await User.findByIdAndUpdate(
        id,
        {
          $push: {
            savedLocations: {
              location: req.body.location,
            },
          },
        },
        { new: true }
      );

      return res.status(200).send(add);
    } catch (error) {
      res.status(500).send(error);
    }
  } else if (req.method === 'DELETE') {
    try {
      const idTwo = req.body.user._id;

      const del = await User.findByIdAndUpdate(
        idTwo,
        {
          $pull: {
            savedLocations: {
              _id: req.body.location,
            },
          },
        },
        { new: true }
      );
      return res.status(200).send(del);
    } catch (e) {
      res.status(500).send(e);
    }
  }
}
