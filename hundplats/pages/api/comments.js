import Location from '../models/location';
import { dbConnect } from '../../util/db';

export default async function handler(req, res) {
  dbConnect();
  if (req.method === 'POST') {
    const id = req.body.location;
    Location.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            comment: req.body.comment,
            userId: req.body.userId,
            userName: req.body.userName,
            avatar: req.body.avatar,
          },
        },
      },
      { new: true },
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.send(result);
      }
    );
  } else if (req.method === 'DELETE') {
    const userId = req.body.userId;
    const comment = req.body.comment;

    Location.find({ 'comments.comment': comment }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        Location.findByIdAndUpdate(
          result[0]._id,
          { $pull: { comments: { comment: comment, userId: userId } } },
          { new: true },
          (err, result) => {
            if (err) return res.status(500).send(err);
            return res.send(result);
          }
        );
      }
    });
  }
}
