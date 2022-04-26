import { useState, useEffect } from 'react';
import styles from '../MapContainer/MapContainer.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  addComment,
  removeComment,
} from '../../../redux/locationActionCreators';
import { printTime } from '../utils/printTime';

const Comments = () => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const user = useSelector((state) => state.loggedInUser);
  const avatars = useSelector((state) => state.avatars);
  const mark = useSelector((state) => state.location);
  const [deletedComment, setDeletedComment] = useState('');

  const sendComment = async () => {
    const newComment = {
      comment,
      location: mark._id,
      userId: user._id,
      userName: user.userName,
      avatar: user.avatarId,
    };
    await dispatch(addComment(newComment));
    setComment('');
  };

  const deleteCommentButton = async () => {
    // This line triggers rendering when a comment is deleted
    await dispatch(removeComment(deletedComment));
    // reset form
    setDeletedComment('');
  };

  return (
    <>
      <div className={styles.commentswrapper}>
        <h2 className={styles.title}>Kommentarer</h2>
        <div className={styles.scrollwrapper}>
          <div className={styles.commentscroll}>
            {mark.comments
              .sort((a, b) => new Date(b.time) - new Date(a.time))
              .map((comment) => (
                <div key={comment._id} className={styles.individualcomment}>
                  <div className={styles.commentimage}>
                    {comment.avatar && (
                      <img
                        src={comment.avatar && avatars.image[comment.avatar]}
                        alt={comment.userName}
                      />
                    )}
                  </div>
                  <div className={styles.commenttext}>
                    <span className={styles.commenthead}>
                      <b>{comment.userName}</b>{' '}
                    </span>
                    <span className={styles.time}>
                      {printTime(comment.time)}
                    </span>

                    <span className={styles.commentbody}>
                      {comment.comment}
                    </span>
                    {/* if the user is logged in, the delete comment button is displayed */}
                    {user._id == comment.userId && !deletedComment && (
                      <span
                        className={styles.deletelink}
                        onClick={() => {
                          setDeletedComment(comment);
                        }}>
                        Ta bort
                      </span>
                    )}
                    {deletedComment && (
                      <div
                        className={`${styles.deletediv} ${
                          deletedComment._id == comment._id ? styles.show : ''
                        }`}>
                        <p> Är du säker på att du vill ta bort kommentaren?</p>
                        <button onClick={() => deleteCommentButton()}>
                          JA
                        </button>
                        <button onClick={() => setDeletedComment('')}>
                          Ångra
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        {user?.userName ? (
          <div className={styles.addcomment}>
            <div className={styles.inputwrapper}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendComment();
                }}>
                <input
                  className={styles.commentinput}
                  type="text"
                  placeholder={'Lägg till en ny kommentar...'}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className={styles.commenbtn}>skicka</button>
              </form>
            </div>
          </div>
        ) : (
          <span className={styles.loggedoutmessage}>
            Vänligen logga in för att kommentera
          </span>
        )}
      </div>
    </>
  );
};

export default Comments;
