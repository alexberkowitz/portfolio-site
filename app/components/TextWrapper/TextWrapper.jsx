/*-------------------------------------------------------*/
/* TEXT WRAPPER
/*-------------------------------------------------------*/
/* Wrapper for text that improves legibility
/* against the page background
/*-------------------------------------------------------*/

'use client'

import styles from './textWrapper.module.scss';

const TextWrapper = (props) => {
  return (
    <span className={styles.textWrapper}>{props.children}</span>
  )
}

export default TextWrapper;