import { useEffect, useState } from 'react';
import { Slide } from 'react-slideshow-image';
import styles from '../MapContainer/MapContainer.module.css';
import { useSelector } from 'react-redux';
import { TiHeart } from 'react-icons/ti';

import { MdPlace } from 'react-icons/md';
import { BiNavigation } from 'react-icons/bi';
import { options } from '../utils/sharedData';
import { printTime } from '../utils/printTime';

// A little helper that cuts the ends of strings that are too long.
const truncateString = (str) => {
  let strLength = 90;

  if (str.length >= strLength) {
    let shortStr = str.slice(0, strLength);
    shortStr.split(' ').pop();
    return shortStr + '...';
  }
  return str;
};

const PopupFront = () => {
  const [comment, setComment] = useState(null);
  const mark = useSelector((state) => state.location);
  const images = useSelector((state) => state.location.images);
  const likes = useSelector((state) => state.location.likes);
  const comments = useSelector((state) => state.location.comments);
  useEffect(() => {
    let numberOfComments = Math.floor(Math.random() * comments.length);
    setComment(comments[numberOfComments]);
  }, [comments]);

  return (
    <>
      <div className={styles.mainwrapper}>
        <h2 className={styles.title}>{mark.name}</h2>
        <div className={styles.info}>
          {mark.category && (
            <span>
              <MdPlace />
              {options.find((cat) => cat.value == mark.category).label}
            </span>
          )}
          <span>
            <TiHeart className={styles.heart} />
            {likes.length == 0 ? 'Ingen gillar än' : `${likes.length} gillar`}
          </span>
          <span>
            <BiNavigation />
            {/* More info about navigation to place with maps: https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html */}
            {mark?.coords ? (
              <a
                href={`http://maps.apple.com/?daddr=${mark.coords.lat},${mark.coords.lng}`}
                target="_blank"
                alt="Klicka för att navigera till plats">
                Navigera hit
              </a>
            ) : (
              ''
            )}
          </span>
        </div>
        <div className={styles.imagewrapper}>
          {images.length > 1 ? (
            <Slide className={styles.slider}>
              {mark.images.map((each, index) => (
                <div key={index} className="each-slide">
                  <img className={styles.imagesingle} src={each.image} />
                </div>
              ))}
            </Slide>
          ) : mark.images.length == 1 ? (
            <div className={styles.singleimagewrapper}>
              <img className={styles.imagesingle} src={mark.images[0].image} />
            </div>
          ) : (
            ''
          )}
        </div>
        <h3 className={styles.aboutheader}>Sagt om platsen</h3>
        <p>
          <q className={styles.quote}>
            {comment && truncateString(comment.comment)}
          </q>{' '}
          {comment && (
            <span className={styles.quotefrom}>
              <b>{comment.userName}</b> - {printTime(comment.time)}
            </span>
          )}
        </p>
      </div>
    </>
  );
};

export default PopupFront;
