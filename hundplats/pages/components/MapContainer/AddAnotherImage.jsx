import styles from './MapContainer.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addImage } from '../../../redux/locationActionCreators';
import { useState } from 'react';

import AddImage from './AddImage';

const AddAnotherImage = ({ setAddAnotherImage, markId }) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState('');
  const user = useSelector((state) => state.loggedInUser);

  const sendImage = () => {
    const newImage = {
      userId: user._id,

      location: markId,
      images: { image, userId: user._id },
    };
    dispatch(addImage(newImage));
    // reset form
    setImage('');
    setAddAnotherImage(false);
  };

  const [showButton, setShowButton] = useState(false);
  const [regretButton, setRegretButton] = useState(true);

  //Triggers Popup to close! This is a button, need to be in a function return because this is the way Leaflet state may be affected
  function SendButton() {
    return (
      <div className={styles.formbuttons}>
        <button className={styles.confirmButton} type='submit' value='Submit'>
          Spara ny bild
        </button>

        <button
          className={styles.cancelButton}
          type='button'
          onClick={() => {
            setImage('');
            setAddAnotherImage(false);
          }}>
          Ångra
        </button>
      </div>
    );
  }

  return (
    <div className={styles.addNewPlaceContainer} style={{ margin: '1.5rem' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendImage();
        }}>
        {!image && (
          <p>
            Ladda upp ytterligare en bild från platsen genom att klicka nedan på
            "Välj fil"
          </p>
        )}
        <AddImage
          setShowSubmitButton={setShowButton}
          image={image}
          setImage={setImage}
          setRegretButton={setRegretButton}
        />

        {showButton && <SendButton />}
      </form>
      {regretButton && (
        <button
          className={styles.cancelButton}
          onClick={() => setAddAnotherImage(false)}>
          Avbryt
        </button>
      )}
    </div>
  );
};

export default AddAnotherImage;
