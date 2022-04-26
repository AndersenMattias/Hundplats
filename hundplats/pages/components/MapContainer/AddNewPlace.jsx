import { Popup, Marker, useMap } from 'react-leaflet';
import styles from './MapContainer.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { createLocation } from '../../../redux/locationActionCreators';
import { useState } from 'react';
import { options } from '../utils/sharedData';
import { tassen } from '../../../redux/reducer';

import AddImage from './AddImage';

const MapLayer = ({ coords }) => {
  const user = useSelector((state) => state.loggedInUser);

  const dispatch = useDispatch();
  //States for form (if no better way to clear form after publish)
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  //CROP IMAGE
  const [image, setImage] = useState(null);

  // Makes new icon that is created when users place a new marker
  const randomIcon = L.icon({
    iconUrl: 'https://image.flaticon.com/icons/png/512/1076/1076928.png',
    iconSize: [35, 35], // size of the icon
    shadowSize: [0, 0], // size of the shadow
    iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  });

  // TODO: Någon kontroll av inlaggda värden? Så att folk inte skickar in tomma strings.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPlace = {
      name,
      category,
      description,
      coords: { lat: coords.lat, lng: coords.lng },
    };
    //Checks if post has image, if so adds it to the object being created
    image ? (newPlace.images = { image, userId: user._id }) : null;

    dispatch(createLocation(newPlace));

    // reset form
    setName('');
    setCategory('');
    setDescription('');
    setImage('');
    dispatch(tassen(false));
  };

  const [showSubmitButton, setShowSubmitButton] = useState(true);
  //Fake button just to fix (in ugly way) problem with props on AddImage.jsx. TODO: Fix?
  const [regretButton, setRegretButton] = useState(false);

  //Triggers Popup to close! This is a button, need to be in a function return because this is the way Leaflet state may be affected
  function SendNewLocationButton() {
    const map = useMap();

    return (
      <div className={styles.formbuttons}>
        <button
          type="submit"
          value="Submit"
          onClick={() => {
            //all of this is required to close the popup (= the location is created)
            name && category && description && map.closePopup();
          }}>
          Spara Platsen
        </button>

        <button
          type="button"
          onClick={() => {
            setName('');
            setCategory('');
            setDescription('');
            setImage('');
          }}>
          Rensa
        </button>
      </div>
    );
  }

  // Popup höjd är anpassad efter mobilens/datorns skärmstorlek
  let height = window.innerHeight * 0.8;
  let width = window.innerwidth < 540 ? window.innerWidth * 0.8 : '45rem';

  return (
    <Marker icon={randomIcon} opacity={0.8} position={coords}>
      <Popup // Moves popup (in this case to the right)
        autoPanPaddingTopLeft={L.point(50, 0)}
        minHeight={height}
        minWidth={width}
        keepInView={true}
        className={styles.popup}>
        <div className={styles.addNewPlaceContainer}>
          <form onSubmit={handleSubmit}>
            {showSubmitButton && (
              <input
                required
                autoComplete="false"
                className={styles.input}
                type="text"
                placeholder="Platsens namn"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            )}

            {showSubmitButton && (
              <select
                required
                className={styles.input}
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}>
                <option value="" hidden>
                  Välj kategori här
                </option>

                {options.map((option) => (
                  <option key={option.key} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {showSubmitButton && (
              <textarea
                required
                rows="5"
                className={styles.input}
                type="text"
                placeholder="Skriv några trevliga rader om platsen"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            )}
            {/* Visa detta om det inte finns någon bild */}
            {!image && (
              <p>
                Ladda gärna upp en bild från platsen genom att klicka nedan på
                "Välj fil"
              </p>
            )}
            <AddImage
              setShowSubmitButton={setShowSubmitButton}
              image={image}
              setImage={setImage}
              setRegretButton={setRegretButton}
              // Skickar coords för att kunna använda den till att centera kartan vid bugg att popup inte påverkas vid uppladdning av för höga bidler
              coords={coords}
            />

            <SendNewLocationButton />
          </form>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapLayer;
