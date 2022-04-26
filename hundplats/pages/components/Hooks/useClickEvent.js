import { useState, useEffect } from 'react';
/**
 * Custom hook for getting a true/false value representing clicks on
 * inside/outside the component that called the hook
 * @param {ref} ref
 * A reference to the DOM element to be tested
 * @param {boolean} initialValue
 * A true/false value representing the initial state of the value returned by the hook
 * (meaning you can choose it the value should be open or closed by default)
 * @returns
 * @param {boolean} clickInside
 * A true/false value representing if a click was generated inside or outside of the component
 */

export default function useClickEvent(ref, initialValue, modal = false) {
  const [clickInside, setClickInside] = useState(initialValue);

  useEffect(() => {
    // checks if origin is mobile or computer and implements the correct event listener
    const translateViewport =
      window.screen.availWidth < 769 ? 'touchend' : 'mouseup';

    function handleClick(event) {
      //make the hook treat the markers as a part of modal and not force quit before opening

      if (ref.current && ref.current.contains(event.target)) {
        setClickInside(true);
        return;
      }
      if (
        modal &&
        event.target?.src == 'https://maps.gstatic.com/mapfiles/transparent.png'
      ) {
        setClickInside(true);
        return;
      }

      // sets the value to true then false as i needed it to play nice with the
      // a useEffect function in the modal.
      setClickInside(true);
      setClickInside(false);
    }
    window.addEventListener(translateViewport, handleClick);

    return () => {
      window.removeEventListener(translateViewport, handleClick);
    };
  }, []);

  return [clickInside];
}
