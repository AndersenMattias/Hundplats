import { useState, useEffect, useRef } from 'react';
import useClickEvent from '../../Hooks/useClickEvent';
import styles from './BottomMenu.module.css';
import { GoSettings } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import { options } from '../../utils/sharedData';
import { tassen, changeCategory } from '../../../../redux/reducer';

/**
 * A function that draws the BottomMenu component to the screen.
 *
 * Takes no props at the moment but:
 * TODO: Implement functionality of the component
 * needs to have global state to render the correct user selections - not implemented yet
 * @returns
 * A JSX component with the Bottom Menu.
 */

// The function that conditionally renders the menu part of the bottom menu.
// separated into it's own function for easier reading.
const Menu = ({ expanded, globalCategory }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.loggedInUser);

  const [category, setCategory] = useState('');

  useEffect(() => {
    if (expanded) {
      if (category == 'Alla') {
        setCategory('');
      }
      dispatch(changeCategory(category));
    }
  }, [category]);

  return (
    <>
      <div className={styles.settingswrapper}>
        <div className={styles.singlesetting}>
          <label>
            Visa platser efter kategori:{' '}
            <select
              className={styles.input}
              value={globalCategory}
              onChange={(e) => {
                if (open) {
                  setCategory(e.target.value);
                }
              }}>
              <option value={null}>Alla</option>

              {options.map((option) => (
                <option key={option.key} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {user?.userName && (
          <div
            onClick={() => {
              dispatch(tassen(true));
            }}
            className={styles.singlesetting}>
            Lägg till en plats
          </div>
        )}
      </div>
    </>
  );
};

const BottomMenu = () => {
  const ref = useRef();
  const globalCategory = useSelector((state) => state.category);
  const [open] = useClickEvent(ref, false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(open);
  }, [open]);

  return (
    <div ref={ref} className={`${styles.menu} ${open ? styles.active : ''}`}>
      <div className={styles.menutextwrapper}>
        <span className={styles.settingsicon}>
          <GoSettings />
        </span>
        {open ? (
          ''
        ) : (
          <span>
            {globalCategory ? (
              <span>
                {' '}
                Visar kategorin:{' '}
                {options.find((option) => option.value == globalCategory).label}
              </span>
            ) : (
              'Kartinställningar'
            )}
          </span>
        )}
      </div>
      {open ? <Menu expanded={expanded} globalCategory={globalCategory} /> : ''}
    </div>
  );
};

export default BottomMenu;
