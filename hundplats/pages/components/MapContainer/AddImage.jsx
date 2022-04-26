import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './MapContainer.module.css';
import { useMap } from 'react-leaflet';

export default function Handler({
  image,
  setImage,
  setShowSubmitButton,
  setRegretButton,
  coords,
}) {
  // Fly to center when an image is selected (to keep popup in the right top corner)
  const map = useMap();

  //Togglar bilden som laddas upp (false när användaren bekräftat)
  const [toggle, useToggle] = useState(false);

  function generateFinalPicture(canvas, crop) {
    const jpegUrl = canvas.toDataURL('image/jpeg');
    setImage(jpegUrl);
  }

  // Ursprunglig bild i Base64 format
  const [upImg, setUpImg] = useState();

  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  // Startvärden påverkar hur den dragbara ytan kommer se ut, således även resultatet av den croppade bilden
  const [crop, setCrop] = useState({
    unit: '%',
    height: 100,
    aspect: 1 / 1,
  });

  // Den slutliga bilden croppad
  const [completedCrop, setCompletedCrop] = useState(null);

  // Användaren väljer vilken fil som ska laddas upp
  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback(img => {
    imgRef.current = img;
    // Flyger kartan rätt när bilden är högre än bred (mer än 1.02)
    coords &&
      imgRef.current.height / imgRef.current.width > 1.02 &&
      map.flyTo(coords);
  }, []);

  // Ställer in den croppade bilden, hur den "får" se ut
  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    //pixelRatio påverkar storleken av bilden. 1 är nog lägsta möjliga...
    const pixelRatio = 1;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    // Ritar ut bilden och hur den kommer se ut i slutändan.
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [completedCrop]);

  return (
    <div className={styles.AddImage}>
      <div>
        <input
          onClick={() => {
            setCrop({
              unit: '%',
              height: 100,
              aspect: 1 / 1,
            });
            useToggle(true);
            // visa inte submitknappen medan användaren fifflar med att lägga upp bild. (för att inte förvirra användaren)
            setShowSubmitButton(false);
            // Nollställer bilden om man väljer en ny (för att undvika bugg)
            setImage('');
          }}
          type="file"
          accept="image/*"
          onChange={onSelectFile}
        />
      </div>
      {toggle && (
        <ReactCrop
          style={{ width: 300 }}
          src={upImg}
          onImageLoaded={onLoad}
          crop={crop}
          // maxWidth={}
          height={200}
          keepSelection={true}
          onChange={c => setCrop(c)}
          onComplete={c => setCompletedCrop(c)}
        />
      )}
      {/* Canvas divven (som visar slutresultatet) måste av någon anledning finnas i return. Jag har dock dolt den för användaren genom display none */}
      <div style={{ display: 'none' }}>
        <canvas
          ref={previewCanvasRef}
          // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
          style={{
            width: Math.round(completedCrop?.width ?? 0),
            height: Math.round(completedCrop?.height ?? 0),
          }}
        />
      </div>
      {toggle && (
        <div className={styles.formbuttons}>
          <button
            className={styles.confirmButton}
            type="button"
            disabled={!completedCrop?.width || !completedCrop?.height}
            onClick={() => {
              generateFinalPicture(previewCanvasRef.current, completedCrop);
              useToggle(false);
              // Möjliggör återigen att skicka in platsen
              setShowSubmitButton(true);
              setRegretButton(false);
              // coords måste finnas och även bildens format ska vara så pass "fel" att vi behöver ta till nödlösningen med att flyga på leaflet och trigga rendering av popup keep in view. Denna händer när man bekräftar bild, men finns även högre upp i denna fil när bilden laddas.
              coords &&
                imgRef.current.height / imgRef.current.width > 1.02 &&
                map.flyTo(coords);
            }}>
            Bekräfta Bild
          </button>
          <button
            style={{ padding: '0.5rem 1rem', margin: '0.25rem 0.12rem' }}
            type="button"
            disabled={!completedCrop?.width || !completedCrop?.height}
            onClick={() => {
              // Användaren vill ångra innan platsen skickas
              setShowSubmitButton(true);
              useToggle(false);
              setCrop({
                unit: '%',
                height: 100,
                aspect: 1 / 1,
              });
            }}>
            Ångra
          </button>
        </div>
      )}
      {/* Visa endast om det finns en bild (så att det blir tydligt för användaren vad som laddas upp om den väljer ny bild) */}
      {image && (
        <span
          style={{
            marginBottom: 0,
          }}>
          Bild som laddas upp: {''}
        </span>
      )}
      <img
        style={{
          width: '75px',
        }}
        src={image}
        alt=""
      />
    </div>
  );
}
