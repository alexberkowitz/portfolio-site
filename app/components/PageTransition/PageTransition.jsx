/*-------------------------------------------------------*/
/* PAGE TRANSITION
/*-------------------------------------------------------*/

'use client'

import { useState, useEffect, useRef } from 'react';
import { useGlobalContext } from '@/GlobalContext';

import styles from './pageTransition.module.scss';

const PageTransition = () => {
  const globalContext = useGlobalContext();
  const [rowCount, setRowCount] = useState(1);
  const [colCount, setColCount] = useState(1);
  const elemRef = useRef(null);
  const pixelSize = 100; // In pixels, approximate value

  useEffect(() => {
    setPixels();
  }, []);

  const setPixels = () => {
    const bounds = elemRef.current.getBoundingClientRect();
    setRowCount(Math.ceil(bounds.height / pixelSize));
    setColCount(Math.ceil(bounds.width / pixelSize));
  }

  return (
    <div
      style={{
        '--rowCount': rowCount,
        '--colCount': colCount
      }}
      className={`${styles.pageTransition} ${globalContext.transition ? styles.active : ''}`}
      ref={elemRef}
      >
      {Array.from({ length: rowCount }, (_, y) => Array.from({ length: colCount }, (_, x) => (
        <div
          key={x * y}
          className={styles.pixel}
          style={{
            '--index': x + y,
          }}
          ></div>
      )))}
    </div>
  );
}

export default PageTransition;