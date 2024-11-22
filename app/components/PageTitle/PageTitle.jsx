/*-------------------------------------------------------*/
/* PAGE TITLE
/*-------------------------------------------------------*/
/* Can display as a sticky title or a marquee
/*-------------------------------------------------------*/

'use client'

import { useRef, useState, useEffect } from 'react';
import { ShowSiteTitle } from '@/components/Header/Header';

import styles from './pageTitle.module.scss';

const PageTitle = (props) => {
  const [initialized, setInitialized] = useState(false);
  const [marqueeSize, setMarqueeSize] = useState(0);
  const [textSize, setTextSize] = useState(0);
  const marqueeRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Set the marquee size on page load
    if( !initialized && props.marquee ){
      setInitialized(true);
      getMarqueeSize();
  
      // Clean up event listeners before component unmounts
      return () => {
        window.removeEventListener("resize", getMarqueeSize);
      }
    }
  }, []);

  // Compute the size of the marquee and the text for use in the animation
  const getMarqueeSize = () => {
    let computedMarqueeSize = 0;
    let computedTextSize = 0;

    if( !!marqueeRef && !!textRef ){
      const computedStyle = window.getComputedStyle(marqueeRef.current);
      const writingMode = computedStyle.writingMode || computedStyle["-webkit-writing-mode"];

      if( writingMode.includes("vertical") ){
        computedMarqueeSize = marqueeRef?.current?.getBoundingClientRect().height;
        computedTextSize = textRef?.current?.getBoundingClientRect().height;
      } else {
        computedMarqueeSize = marqueeRef?.current?.getBoundingClientRect().width;
        computedTextSize = textRef?.current?.getBoundingClientRect().width;
      }
    }

    setMarqueeSize(computedMarqueeSize);
    setTextSize(computedTextSize);
  }

  // Render the marquee
  if( props.marquee ){
    window.addEventListener("resize", getMarqueeSize);
    let numberOfCopies = marqueeSize / textSize + 1;

    return (
      <div className={styles.marqueeTitle} data-site-title-shown={ShowSiteTitle()}>
        <div
          className={styles.marqueeWrapper}
          ref={marqueeRef}
          style={{
            '--textWidth': textSize
          }}
          >
          <div className={styles.marqueeContent}>
            <h1 ref={textRef}>{props.children}</h1>
            <div className={styles.marqueeCopies}>
              {Array.from({ length: numberOfCopies }, (_, index) => (
                <h1 key={index} tabIndex="-1">{props.children}</h1>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  // Render the basic title
  } else {
    return (
      <h1 className={styles.pageTitle}>
        {props.children}
      </h1>
    );
  }
}

export default PageTitle;