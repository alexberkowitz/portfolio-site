/*-------------------------------------------------------*/
/* Loader
/*-------------------------------------------------------*/

'use client'

import { useEffect, useState } from 'react';
import Icon from '@/components/Icon/Icon';

const Loader = (props) => {
  const styles = props.styles;
  const [running, setRunning] = useState(true);
  const [dimensions, setDimensions] = useState({w: 1920, h: 1080});

  const disableDelay = 1; // Seconds it takes for the loader to be hidden after the transition ends

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

  const getDimensions = () => {
    setDimensions({
      w: window.innerWidth,
      h: window.innerHeight
    })
  }

  return (
    <div
      className={styles.loader}
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