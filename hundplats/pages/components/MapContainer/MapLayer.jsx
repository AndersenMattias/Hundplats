import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'react-slideshow-image/dist/styles.css';
import MapPlaces from './MapPlaces';
import AddNewPlace from './AddNewPlace';

import { useSelector } from 'react-redux';

/**
 * A function that draws the Map component to the screen.
 *
 * Takes no props at the moment.
 * @returns
 * A JSX component with the Map screen.
 */

const MapLayer = () => {
  const center = useSelector((state) => state.centerOfMap);
  const tassen = useSelector((state) => state.tassen.value);

  // change the state for "Show More" in the popup modal
  const [toggle, useToggle] = useState(true);

  //state of the cursor that the user places on the map
  const [coords, setCoords] = useState(center);

  return (
    <>
      <MapContainer
        whenReady={(map) => {
          map.target.on('click', (e) => {
            //Shows and uses the coordinates that the user click on (the map), to place marker on map
            //center on location where user wants to put a new location
            setCoords(e.latlng);
          });
        }}
        center={center}
        setCenter={center}
        zoom={12}
        // scrollWheelZoom={true}
        style={{
          height: '87.5%',
          width: '100%',
          marginTop: '0',
          position: 'absolute',

          left: '0',
        }}
        // closePopup()
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <MapPlaces toggle={toggle} useToggle={useToggle} />

        {tassen ? <AddNewPlace coords={coords} /> : ''}
      </MapContainer>
    </>
  );
};

export default MapLayer;
