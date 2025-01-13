/*-------------------------------------------------------*/
/* Loader
/*-------------------------------------------------------*/

'use client'

import { useEffect, useState, useRef } from 'react';
import Icon from '@/components/Icon/Icon';

const Loader = (props) => {
  const styles = props.styles;
  const [running, setRunning] = useState(true);
  const [dimensions, setDimensions] = useState({w: 1920, h: 1080});
  const loaderRef = useRef(null);

  const disableDelay = 1; // Seconds it takes for the loader to be hidden after the transition ends

  const getDimensions = () => {
    setDimensions({
      w: loaderRef.current.offsetWidth,
      h: loaderRef.current.offsetHeight
    });
  }

  // Start the animation immediately
  useEffect(() => {
    getDimensions();
    window.addEventListener("resize", getDimensions);

    // Clean up before unmounting
    return () => {
      window.removeEventListener("resize", getDimensions);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if( props.active ){ // Start the animation immediately when setting active to true
      setRunning(true);

    } else { // End the animation after a delay when setting active to false
      setTimeout(() => {
        setRunning(false);
      }, disableDelay * 1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.active]);

  return (
    <div
      className={styles.loader}
      ref={loaderRef}
      data-active={props.active}
      data-running={running}
      style={{
        transitionDuration: `${disableDelay}s`,
        '--w': dimensions.w,
        '--h': dimensions.h
      }}
      >
        <div className={styles.icon} >
          <Icon type="logo" />
        </div>
      </div>
  );
}

export default Loader;