/*-------------------------------------------------------*/
/* Loader
/*-------------------------------------------------------*/

'use client'

import { useEffect, useRef } from 'react';
import Icon from '@/components/Icon/Icon';

const Loader = (props) => {
  const styles = props.styles;
  const animate = useRef(true);
  const pos = useRef({x: 0, y: 0});
  const xDirection = useRef(1); // 1 for left, -1 for right
  const yDirection = useRef(1); // 1 for down, -1 for up
  const speed = .75; // For simplicity, the speed is a fraction of the image width per second
  const disableDelay = .5; // Seconds it takes for the loader to be hidden
  const containerRef = useRef(null);
  const iconRef = useRef(null);

  // Start the animation immediately
  useEffect(() => {
    requestAnimationFrame(moveLoader);
  }, []);

  useEffect(() => {
    if( props.active ){ // Start the animation immediately when setting active to true
      animate.current = true;
      requestAnimationFrame(moveLoader);

    } else { // End the animation after a delay when setting active to false
      setTimeout(() => {
        animate.current = false;
      }, disableDelay * 1000);
    }
  }, [props.active]);


  let prevTimestamp;
  const moveLoader = (timestamp) => {
    if( animate.current === true ){
      if( prevTimestamp === undefined ){
        prevTimestamp = timestamp;
      }

      // Change direction as needed
      if( pos.current.x <= 0 ){ // Left or right
        xDirection.current = 1;
      } else if( pos.current.x + iconRef.current.offsetWidth >= containerRef.current.offsetWidth ){
        xDirection.current = -1;
      }
      if( pos.current.y <= 0 ){ // Up or down
        yDirection.current = 1;
      } else if( pos.current.y + iconRef.current.offsetHeight >= containerRef.current.offsetHeight ){
        yDirection.current = -1;
      }

      // Calculate the time difference from the previous frame
      // in order to maintain a constant velocity
      const timeChange = timestamp - prevTimestamp;

      const speedVal = iconRef.current.offsetWidth * speed;

      // Move the icon
      pos.current = {
        x: pos.current.x + (speedVal * timeChange * xDirection.current / 1000),
        y: pos.current.y + (speedVal * timeChange * yDirection.current / 1000)
      };
      console.log(pos.current);
      iconRef.current.style.left = `${pos.current.x}px`;
      iconRef.current.style.top = `${pos.current.y}px`;

      prevTimestamp = timestamp;

      requestAnimationFrame(moveLoader);
    }
  }

  return (
    <div
      className={styles.loader}
      ref={containerRef}
      data-active={props.active}
      style={{ transitionDuration: `${disableDelay}s` }}
      >
        <div
          className={styles.icon}
          ref={iconRef}
          >
          <Icon type="logo" />
        </div>
      </div>
  );
}

export default Loader;