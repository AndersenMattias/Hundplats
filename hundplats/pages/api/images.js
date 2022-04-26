import Location from '../models/location';
import { dbConnect } from '../../util/db';

export default async function handler(req, res) {
  dbConnect();

  if (req.method === 'POST') {
    try {
      const userId = req.body;

      const locations = await Location.find({
        // Only the user's images are downloaded from backend
        'images.userId': userId,
      });
      res.status(200).send(locations);
    } catch (error) {
      res.status().send(error.message);
    }
  } else if (req.method === 'DELETE') {
    const userId = req.body.userId;
    const image = req.body.image;

    Location.find({ 'images.image': image }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        Location.findByIdAndUpdate(
          result[0]._id,
          { $pull: { images: { image: image, userId: userId } } },
          { new: true },
          (err, result) => {
            if (err) return res.status(500).send(err);
            return res.send(result);
          }
        );
      }
    });
  } else if (req.method === 'PUT') {
    const id = req.body.location;
    const image = req.body.images.image;
    const userId = req.body.images.userId;

    Location.findByIdAndUpdate(
      id,
      {
        $push: {
          images: { userId: userId, image: image },
        },
      },
      { new: true },
      (err, result) => {
        if (err) return res.status(500).send(err);
        return res.send(result);
      }
    );
  } else if (req.method === 'GET') {
    try {
      const locations = await Location.find({
        'images.image': { $regex: 'data' },
      });

      res.status(200).send(locations);
    } catch (error) {
      res.status(500).send();
    }
  }
}
