/*-------------------------------------------------------*/
/* TEXT WRAPPER
/*-------------------------------------------------------*/
/* Wrapper for text with various functions
/*-------------------------------------------------------*/

'use client'

import styles from './text.module.scss';

const Text = (props) => {
  switch( props.style ) {

    // Apply the accentColor as a background to the text
    case 'accent':
      return <span className={styles.accent}>{props.children}</span>
      
    // Apply the fgColor and italics to the text
    case 'emphasis':
      return <span className={styles.emphasis}>{props.children}</span>

    // The default text wrapper provides a background that matches the page
    // background to improve legibility against the grid background and any
    // other effects that sit behind the text.
    default:
      return <span className={styles.textWrapper}>{props.children}</span>
  
  }
}

export default Text;