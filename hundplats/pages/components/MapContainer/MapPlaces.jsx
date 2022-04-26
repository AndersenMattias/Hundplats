import { useState, useEffect, useRef } from 'react';
import { LayerGroup, Marker, Popup } from 'react-leaflet';
import styles from '../MapContainer/MapContainer.module.css';
import 'react-slideshow-image/dist/styles.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  like,
  unLike,
  fetchLocation,
  cleanLocation,
} from '../../../redux/locationActionCreators';
import { saveLocationUserPage } from '../../../redux/userActionCreators';

import { GoCommentDiscussion } from 'react-icons/go';
import { RiImageAddFill } from 'react-icons/ri';
import { TiHeartOutline, TiHeart, TiArrowBackOutline } from 'react-icons/ti';
import { FaMapMarked } from 'react-icons/fa';
import useClickEvent from '../Hooks/useClickEvent';
import Comments from './Comments';
import PopupFront from './PopupFront';
import AddAnotherImage from './AddAnotherImage';

const MapPlaces = ({ toggle, useToggle }) => {
  //Alla våra locations, enbart med id, coords, category
  const markers = useSelector((state) => state.pins);

  const user = useSelector((state) => state.loggedInUser);

  // en enskild location
  const mark = useSelector((state) => state.location);

  const globalCategory = useSelector((state) => state.category);

  const dispatch = useDispatch();

  const [comments, setComments] = useState(false);
  const [spin, setSpin] = useState(false);
  const [buttonSpin, setButtonSpin] = useState(false);
  const [addAnotherImage, setAddAnotherImage] = useState(false);
  const [likeBtn, setLikeBtn] = useState(false);

  const ref = useRef();
  const [clickInside] = useClickEvent(ref, false);
  // const [mark, setMark] = useState();
  useEffect(() => {
    if (mark && mark.likes.find((like) => like.from === user._id)) {
      setLikeBtn(true);
    } else {
      setLikeBtn(false);
    }
  }, [mark]);

  useEffect(() => {
    if (!clickInside) {
      dispatch(cleanLocation());
    }
    if (!mark) {
      setComments(false);
      setSpin(false);
      setButtonSpin(false);
    }
  }, [clickInside]);
  // Popup höjd är anpassad efter mobilens/datorns skärmstorlek
  let height = window.innerHeight * 0.8;
  let width = window.innerwidth < 540 ? window.innerWidth * 0.8 : '45rem';
  return (
    <>
      <LayerGroup>
        {markers &&
          markers
            .filter(
              (marker) =>
                marker.category == globalCategory || globalCategory == []
            )
            .map((marker) => {
              return (
                <Marker
                  key={marker._id}
                  position={marker.coords}
                  eventHandlers={{
                    click: (e) => {
                      dispatch(fetchLocation(marker));
                    },
                  }}
                />
              );
            })}
      </LayerGroup>
      {mark && (
        <Popup
          // Moves popup (in this case to the right)
          position={mark.coords}
          autoPanPaddingTopLeft={L.point(50, 0)}
          minHeight={height}
          minWidth={width}
          keepInView={true}
          className={styles.popup}>
          {/* ---------- Hela popupkomponenten börjar här ------- */}
          <div
            ref={ref}
            className={`${styles.wholecontainer} ${spin ? styles.spin : ''}`}>
            {/* -------Conditional rednder som visar front / back(comments) -----      */}
            {!comments ? <PopupFront mark={mark} /> : <Comments mark={mark} />}
            {/* ---------Här börjar knappraden----------- */}
            <div
              className={`${styles.buttonrow} ${spin ? styles.spin : ''} ${
                buttonSpin ? styles.buttonRowSpin : ''
              }`}>
              <div className={styles.buttonwrapper}>
                {/* --------Conditional render för knappen front/back---------   */}
                {!comments ? (
                  <>
                    <GoCommentDiscussion
                      className={styles.commentbtn}
                      onClick={() => {
                        if (!addAnotherImage) {
                          setSpin(!spin);
                          useToggle(!toggle);
                          // setButtonSpin(false);
                          setTimeout(() => {
                            setButtonSpin(true);
                            setComments(!comments);
                          }, 250);
                        }
                      }}
                    />
                    <span>Kommentera</span>
                  </>
                ) : (
                  <>
                    {' '}
                    <TiArrowBackOutline
                      className={styles.commentbtn}
                      onClick={() => {
                        if (!addAnotherImage) {
                          setSpin(!spin);
                          useToggle(!toggle);
                          // setButtonSpin(true);
                          setTimeout(() => {
                            setButtonSpin(false);
                            setComments(!comments);
                          }, 250);
                        }
                      }}
                    />
                    <span>tillbaka</span>
                    {/* --------Conditional render slut----------- */}
                  </>
                )}
              </div>
              <div className={styles.buttonwrapper}>
                {/* ------Conditional render för att visa samt logik för att lägga
                            till/ta bort likes-------   */}
                {likeBtn ? (
                  <>
                    <TiHeart
                      className={`${styles.commentbtn} ${styles.heart}`}
                      onClick={async () => {
                        dispatch(
                          unLike({
                            location: mark._id,
                            from: user._id,
                          })
                        );
                        setLikeBtn(false);
                      }}
                    />
                    <span>Gillar</span>
                  </>
                ) : (
                  <>
                    <TiHeartOutline
                      className={styles.commentbtn}
                      onClick={async () => {
                        if (user?.name) {
                          dispatch(
                            like({
                              location: mark._id,
                              from: user._id,
                            })
                          );
                          setLikeBtn(true);
                        }
                      }}
                    />

                    {user?.name ? (
                      <span>Gilla</span>
                    ) : (
                      <>
                        <span>Logga in</span>

                        <span>för att gilla</span>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className={styles.buttonwrapper}>
                {/* -------Lägga till bild--------- */}
                {!addAnotherImage && !comments ? (
                  <>
                    <RiImageAddFill
                      className={styles.commentbtn}
                      onClick={() => {
                        if (user?.name) {
                          setAddAnotherImage(true);
                        }
                      }}
                    />
                    {user?.name ? (
                      <>
                        <span>Lägg till</span>
                        <span>Bild</span>
                      </>
                    ) : (
                      <>
                        <span>Logga in</span>
                        <span>för att bidra</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <RiImageAddFill
                      className={`${styles.commentbtn} ${styles.greyedout}`}
                    />
                    <span>Lägg till</span>
                    <span>Bild</span>
                  </>
                )}
              </div>
              <div className={styles.buttonwrapper}>
                {/* ---------Spara till mina platser-------- */}
                <FaMapMarked
                  className={styles.commentbtn}
                  onClick={() => {
                    if (
                      user.savedLocations &&
                      user.savedLocations.find(
                        (x) => x.location.locationId == mark._id
                      )
                    ) {
                      return;
                    } else {
                      dispatch(
                        saveLocationUserPage({
                          location: {
                            locationId: mark._id,
                            name: mark.name,
                            category: mark.category,
                            description: mark.comments[0].comment,
                            coords: mark.coords,
                          },
                          to: user._id,
                        })
                      );
                    }
                  }}
                />
                <span>Spara till</span>
                <span>mina platser</span>
              </div>
            </div>
            {addAnotherImage && (
              <div className={styles.addAnotherImage}>
                <AddAnotherImage
                  markId={mark._id}
                  setAddAnotherImage={setAddAnotherImage}
                />
              </div>
            )}
          </div>
        </Popup>
      )}
    </>
  );
};

export default MapPlaces;
