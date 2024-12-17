/*-------------------------------------------------------*/
/* PAGE TRANSITION
/*-------------------------------------------------------*/

'use client'

import { useState, useEffect, useRef } from 'react';
import { useGlobalContext } from '@/GlobalContext';

import styles from './pageTransition.module.scss';

const PageTransition = () => {
  const globalContext = useGlobalContext();
  const [active, setActive] = useState(true);
  const [rowCount, setRowCount] = useState(1);
  const [colCount, setColCount] = useState(1);
  const [startSquare, setStartSquare] = useState([0,0]);
  const elemRef = useRef(null);
  const squareSize = 100; // In pixels, approximate value

  useEffect(() => {
    setSquares();
  }, []);

  useEffect(() => {
    getStartSquare();
  }, [rowCount, globalContext.transition]);

  useEffect(() => {
    setActive(globalContext.transition.active);
  }, [startSquare]);

  const setSquares = () => {
    const bounds = elemRef.current.getBoundingClientRect();
    setRowCount(Math.ceil(bounds.height / squareSize));
    setColCount(Math.ceil(bounds.width / squareSize));
  }

  // Determine which pixel the transition should start on, based on screen coordinates
  const getStartSquare = () => {
    const startCoords = [
      Math.round(globalContext.transition.x / squareSize),
      Math.round(globalContext.transition.y / squareSize)
    ];
    setStartSquare(startCoords);
  }

  // Calculate how far a given pixel is from the start, as a percentage,
  // based on a provided X,Y pixel value
  const getSquareDistance = (x, y) => {
    // Calculate the distance (in squares) from the start point
    const xDistance = Math.abs(x - startSquare[0]);
    const yDistance = Math.abs(y - startSquare[1]);
    const distance = Math.sqrt(xDistance**2 + yDistance**2);

    // The radius of the animation is determined by the distance between the start
    // point and the farthest corner
    const xExtent = Math.max(startSquare[0], colCount - startSquare[0]);
    const yExtent = Math.max(startSquare[1], rowCount - startSquare[1]);
    const radius = Math.sqrt(xExtent**2 + yExtent**2);

    return distance / radius;
  }

  return (
    <div
      style={{
        '--rowCount': rowCount,
        '--colCount': colCount
      }}
      className={`${styles.pageTransition} ${active ? styles.active : ''}`}
      ref={elemRef}
      >
      {Array.from({ length: rowCount }, (_, y) => Array.from({ length: colCount }, (_, x) => (
        <div
          key={x * y + x}
          className={styles.pixel}
          style={{
            '--delayMultiplier': getSquareDistance(x, y),
          }}
          ></div>
      )))}
    </div>
  );
}

export default PageTransition;