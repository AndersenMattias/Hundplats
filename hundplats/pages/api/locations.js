import Location from '../models/location';
import { dbConnect } from '../../util/db';

export default async function handler(req, res) {
  dbConnect();

  if (req.method === 'POST') {
    const location = new Location(req.body);
    try {
      await location.save();
      res.status(201).send(location);
    } catch (error) {

      res.status.send(error);

    }
  } else if (req.method === 'PATCH') {
    try {
      const location = await Location.findById(req.body._id);

      res.status(201).send(location);
    } catch (error) {
      res.status(500).send(e);
    }
  } else {
    try {
      const locations = await Location.find({}).select('coords category');

      res.status(200).send(locations);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
