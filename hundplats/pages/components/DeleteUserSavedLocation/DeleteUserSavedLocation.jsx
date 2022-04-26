import { useDispatch, useSelector } from 'react-redux';

import { FaWindowClose } from 'react-icons/fa';

import { deleteLocationUserPage } from '../../../redux/userActionCreators';
import styles from './DeleteUserSavedLocation.module.css';

const DeleteUserSavedLocation = ({ setDeleteModal, locationId }) => {
  const user = useSelector((state) => state.loggedInUser);

  const dispatch = useDispatch();

  return (
    <>
      <div className={styles.deleteModalContainer}>
        <FaWindowClose
          className={styles.close}
          onClick={() => {
            setDeleteModal(false);
          }}
        />
        <h3 className={styles.txtModal}>
          Vill ni ta bort den här platsen från er lista?
        </h3>
        <div className={styles.containerBtns}>
          <div className={styles.modalBtns}>
            <button
              className={styles.modalBtnsOne}
              onClick={() => {
                dispatch(
                  deleteLocationUserPage({ user: user, location: locationId })
                );
                setDeleteModal(false);
              }}>
              Ja
            </button>
          </div>
          <div className={styles.modalBtns}>
            <button
              className={styles.modalBtnsTwo}
              onClick={() => {
                setDeleteModal(false);
              }}>
              Avbryt
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteUserSavedLocation;
