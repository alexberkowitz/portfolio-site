/*-------------------------------------------------------*/
/* SCROLL WRAPPER
/*-------------------------------------------------------*/
/* Enables custom scrollbars
/*-------------------------------------------------------*/

'use client'

import { Scrollbar } from 'react-scrollbars-custom';

import styles from './scrollBar.module.scss';

const ScrollBar = (props) => {

  return (
    <Scrollbar
      noDefaultStyles
      noScrollX
      onScrollStart={() => { document.body.classList.add('scrolling') }}
      onScrollStop={() => { document.body.classList.remove('scrolling') }}
      renderer={(props) => {
        const { elementRef, key, ...restProps } = props;
        return <div key={key} {...restProps} ref={elementRef} className={styles.scrollbar} />;
      }}
      wrapperProps={{
        renderer: (props) => {
          const { elementRef, key, ...restProps } = props;
          return <div key={key} {...restProps} ref={elementRef} className={styles.scrollbarWrapper} />;
        },
      }}
      trackYProps={{
        renderer: (props) => {
          const { elementRef, key, ...restProps } = props;
          return <div key={key} {...restProps} ref={elementRef} className={styles.trackY} />;
        },
      }}
      thumbYProps={{
        renderer: (props) => {
          const { elementRef, key, ...restProps } = props;
          return <div key={key} id="scrollbar-thumb" {...restProps} ref={elementRef} className={styles.thumbY} />;
        },
      }}
      >
      {props.children}
    </Scrollbar>
  );
}

export default ScrollBar;