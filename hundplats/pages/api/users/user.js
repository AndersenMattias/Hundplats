import User from '../../models/user';
import { dbConnect } from '../../../util/db';
dbConnect();

const { sendWelcomeEmail, sendCancelEmail } = require('../../emails/account');

export default async function userHandler(req, res) {
  switch (req.method) {
    case 'POST':
      const user = new User(req.body);

      try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        res.status(201).send({ user });
      } catch (e) {
        //keyValue is not met in this case we check unique so if keyValue is part of error on user, it means user is not unique.
        //We send this error back to frontend so that user can change the value and try again
        if (e.keyValue) {
          res.status(400).send({ error: e.keyValue });
        } else {
          res.status(400).send(e);
        }
      }

      break;

    case 'PATCH':
      const userUpdate = req.body;

      // destruct för att få igenom nya uppdaterade värdena
      const { id, name, userName, email, avatarId } = userUpdate;

      User.findByIdAndUpdate(
        id,
        {
          name,
          userName,
          email,
          avatarId,
        },
        { new: true },
        (err, result) => {
          //keyValue is not met in this case we check unique so if keyValue is part of error on user, it means user is not unique.
          //We send this error back to frontend so that user can change the value and try again
          if (err && err.keyValue) {
            console.log(err);
            res.status(400).send({ error: err.keyValue });
          } else if (err) {
            console.log(err);
            res.status(400).send(err);
          }
          return res.status(201).send(result);
        }
      );

      break;

    case 'DELETE':
      User.findByIdAndDelete(req.body._id, (err, result) => {
        if (!err) {
          res.send(result);
          sendCancelEmail(result.email, result.name);
        }
        res.status(500).send();
      });

      break;

    default:
      throw new Error();
  }
}
