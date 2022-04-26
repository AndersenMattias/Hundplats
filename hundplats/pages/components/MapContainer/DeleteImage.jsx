import React from 'react';
import { removeImage } from '../../../redux/locationActionCreators';
import styles from './MapContainer.module.css';
import { useDispatch } from 'react-redux';

const DeleteImage = ({
  deletedImage,
  setDeletedImage,
  setShowSelectedImage,
}) => {
  const dispatch = useDispatch();

  const deleteImageButton = async () => {
    // This line is needed to trigger rendering when an image is removed
    await dispatch(removeImage(deletedImage));
    // reset form
    setDeletedImage('');
    setShowSelectedImage(false);
  };

  return (
    <div className={styles.removeImageContainer}>
      <p>
        Är du säker på att du vill ta bort denna bild? (Det går inte att ångra
        sen)
      </p>

      <img
        style={{
          width: '60vw',
          border: '1px solid black',
          margin: '2%',
        }}
        src={deletedImage.image}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          deleteImageButton();
        }}>
        <div className={styles.formbuttons}>
          <button className={styles.confirmButton} type="submit" value="Submit">
            Ja, jag är säker
          </button>
          <button
            className={styles.cancelButton}
            type="button"
            onClick={() => {
              setShowSelectedImage(false);
            }}>
            Ångra
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteImage;
