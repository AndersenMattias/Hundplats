import { useState, useEffect, useRef } from 'react';
import {
  RiMenuLine,
  RiSettings4Line,
  RiLogoutCircleRLine,
  RiImage2Fill,
} from 'react-icons/ri';
import Link from 'next/link';
import useClickEvent from '../../Hooks/useClickEvent';
import styles from './MainMenu.module.css';
import { useDispatch } from 'react-redux';
import { logOutUser } from '../../../../redux/userActionCreators';
import LoadingPage from '../../utils/LoadingPage';

/**
 * A function that draws the Main menu component to the screen.
 *
 * Takes no props at the moment but:
 * @returns
 * A JSX component with the Main menu.
 */

const MainMenu = () => {
  const [open, setOpen] = useState(false); //for conditional rendeing of open state of menu.
  const [logOutPopup, setLogOutPopup] = useState(false); //for conditional rendering of logout message
  const dispatch = useDispatch();
  const ref = useRef();
  const [clickInside] = useClickEvent(ref, true);

  useEffect(() => {
    if (clickInside == false) {
      setOpen(false);
    }
  }, [clickInside]);

  return (
    <div ref={ref}>
      <div
        className={`${styles.logoutpopup} ${
          logOutPopup ? styles.logoutactive : ''
        }`}>
        <LoadingPage>
          <h3>Loggar ut nu</h3>
          <p>Välkommen åter!</p>
        </LoadingPage>
      </div>
      <div className={styles.btn}>
        <RiMenuLine className={styles.menubtn} onClick={() => setOpen(!open)} />
      </div>
      <div
        className={`${styles.menu} ${styles.clamped} ${
          open && clickInside ? styles.active : ''
        }`}>
        <div className={styles.row}>
          <img
            className={styles.icon}
            src="/pawheart.svg"
            width="26px"
            alt="my page"
          />
          <Link href={`/savedlocations`}>
            <h3 onClick={() => setOpen(false)}>Sparade platser</h3>
          </Link>
        </div>
        <div className={styles.row}>
          <RiImage2Fill className={styles.cog} />

          <Link href={`/myimages`}>
            <h3 onClick={() => setOpen(false)}>Mina bilder</h3>
          </Link>
        </div>
        <div className={styles.row}>
          <RiSettings4Line className={styles.cog} />

          <Link href={`/settings`}>
            <h3 onClick={() => setOpen(false)}>Inställningar</h3>
          </Link>
        </div>
        <div className={styles.row}>
          <RiLogoutCircleRLine className={styles.logout} />
          <h3
            onClick={() => {
              setLogOutPopup(true);
              setOpen(false);
              setTimeout(() => {
                //displaya a logout message for 1 second
                setLogOutPopup(false);
                dispatch(logOutUser());
              }, 1000);
            }}>
            Logga ut
          </h3>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
