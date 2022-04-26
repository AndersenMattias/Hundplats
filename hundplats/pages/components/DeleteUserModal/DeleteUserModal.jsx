import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useClickEvent from '../Hooks/useClickEvent';
import { FaWindowClose } from 'react-icons/fa';

import { deleteUser } from '../../../redux/userActionCreators';
import styles from './DeleteUserModal.module.css';
import LoadingPage from '../../components/utils/LoadingPage';

const DeleterUserModal = ({ deleteModal, setDeleteModal }) => {
  const [logOutPopup, setLogOutPopup] = useState(false); //for conditional rendering of logout message
  const user = useSelector((state) => state.loggedInUser);
  const dispatch = useDispatch();

  return (
    <>
      <div
        className={`${styles.logoutpopup} ${
          logOutPopup ? styles.logoutactive : ''
        }`}>
        <LoadingPage>
          <h2>Välkommen åter!</h2>
        </LoadingPage>
      </div>
      {deleteModal ? (
        <div className={styles.deleteModalContainer}>
          <FaWindowClose
            className={styles.close}
            onClick={() => {
              setDeleteModal(false);
            }}
          />
          <h3 className={styles.txtModal}>Vill ni radera ert konto?</h3>
          <div className={styles.containerBtns}>
            <div className={styles.modalBtns}>
              <button
                className={styles.modalBtnsOne}
                onClick={() => {
                  setLogOutPopup(true);

                  setTimeout(() => {
                    //displaya ett meddelande i två sekunder

                    setLogOutPopup(false);
                    setDeleteModal(false);
                    dispatch(deleteUser(user));
                  }, 2000);
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
      ) : (
        ''
      )}
    </>
  );
};

export default DeleterUserModal;
