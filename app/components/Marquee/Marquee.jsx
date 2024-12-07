/*-------------------------------------------------------*/
/* MARQUEE
/*-------------------------------------------------------*/
/**
 * Global page title element with scrolling effect
 * 
 * Pulls page title from path name (same as Next.js)
 */

'use client'

import { useRef, useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { includesAny } from '@/utils/utils';
import * as Constants from '@/Constants';

import styles from './marquee.module.scss';

const Marquee = () => {
  const pathname = usePathname();

  const [initialized, setInitialized] = useState(false);
  const [text, setText] = useState(''); // What text to display
  const [show, setShow] = useState(true); // Show or hide the marquee
  const [fade, setFade] = useState(false); // Used for transitions
  const [marqueeSize, setMarqueeSize] = useState(0);
  const [textSize, setTextSize] = useState(0);
  const marqueeRef = useRef(null);
  const textRef = useRef(null);

  const ignoredPages = ["/", "/person", "/projects/*", "/demo", "/resume"]; // Pages on this list won't show the marquee


  // Set the marquee parameters on load
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);
      updateText();
      getMarqueeSize();
  
      // Clean up event listeners before component unmounts
      return () => {
        window.removeEventListener("resize", getMarqueeSize);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Update the marquee text when the global title value changes
  useEffect(() => {
    updateText();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  // When the text changes, compute the marquee parameters
  useEffect(() => {
    getMarqueeSize();
    if( !!text ){ // Sometimes we fade out before setting text, so fade back in
      setFade(false);
    }
  }, [text]);


  // Update the marquee text and animate as necessary
  const updateText = () => {
    const nextText = pathname.split('/')[pathname.split('/').length - 1]; // The title is derived from the page path

    if( includesAny(pathname, ignoredPages) ){ // On ignored pages, hide the title
      setShow(false);
      setTimeout(() => {
        setText(nextText);
      }, Constants.titleDuration * 1000);

    } else {
      if( show ){ // The title is currently showing
        if( !!text ){ // If we're swapping text, fade out the current text
        }
        setFade(true);
        setTimeout(() => {
          setText(nextText);
        }, Constants.titleDuration * 1000);
      } else {
        setText(nextText);
        setShow(true);
      }
    }
  }


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
  window.addEventListener("resize", getMarqueeSize);
  let numberOfCopies = textSize > 0 ? marqueeSize / textSize + 1 : 1;

  return (
    <div className={`${styles.marqueeTitle} ${show ? styles.leaveRoom : ''}`} aria-hidden={show ? 'false' : 'true'}>
      <div
        className={`${styles.marqueeWrapper} ${show ? styles.show : ''} ${fade ? styles.fade : ''}`}
        ref={marqueeRef}
        style={{
          '--textWidth': textSize, // This allows us to define the animation speed rather than the duration
        }}
        >
        {!!text && (  
          <div className={styles.marqueeContent}>
            <h1 ref={textRef}>{text}</h1>
            <div className={styles.marqueeCopies}>
              {Array.from({ length: numberOfCopies }, (_, index) => (
                <h1 key={index} tabIndex="-1">{text}</h1>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Marquee;