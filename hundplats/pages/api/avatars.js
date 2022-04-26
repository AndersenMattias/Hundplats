import { dbConnect } from '../../util/db';
import Avatar from '../models/avatar';

export default async function fetchUser(req, res) {
  dbConnect();

  try {
    const response = await Avatar.find({});
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
}
