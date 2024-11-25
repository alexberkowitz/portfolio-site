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
      onScrollStart={() => { document.body.classList.add('is-scroll') }}
      onScrollStop={() => { document.body.classList.remove('is-scroll') }}
      renderer={(props) => {
        const { elementRef, ...restProps } = props;
        return <div {...restProps} ref={elementRef} className={styles.scrollbar} />;
      }}
      wrapperProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <div key="wrapper" {...restProps} ref={elementRef} className={styles.scrollbarWrapper} />;
        },
      }}
      trackYProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <div key="trackY" {...restProps} ref={elementRef} className={styles.trackY} />;
        },
      }}
      thumbYProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <div key="thumbY" id="scrollbar-thumb" {...restProps} ref={elementRef} className={styles.thumbY} />;
        },
      }}
      >
      {props.children}
    </Scrollbar>
  );
}

export default ScrollBar;