import { dbConnect } from '../../../util/db';
import User from '../../models/user';

export default async function fetchUser(req, res) {
  dbConnect();
  //Errors are sent to front-end, do not remove
  if (req.method === 'POST') {
    try {
      const response = await User.findOne({
        userName: req.body.name,
      });
      if (response == null) {
        res.status(401).send({ error: 'No such user' });
        return;
      }
      const validPassword = await response.comparePassword(req.body.password);

      if (validPassword) {
        res.status(201).send(response);
      } else {
        res.status(401).send({ error: 'Wrong password' });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
