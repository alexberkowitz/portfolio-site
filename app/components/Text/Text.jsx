/*-------------------------------------------------------*/
/* TEXT WRAPPER
/*-------------------------------------------------------*/
/**
 * Wrapper for text with various functions
 * 
 * By default, this component provides a background that
 * matches the page bg to improve legibility against any
 * visual effects that sit behind the text.
 */

'use client'

import styles from './text.module.scss';

const Text = (props) => {
  const { type, children, ...rest } = props;
  return <span className={!!props.type ? styles[type] : styles.textWrapper} {...rest}>{children}</span>;
}

export default Text;