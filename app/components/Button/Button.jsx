/*-------------------------------------------------------*/
/* BUTTON
/*-------------------------------------------------------*/

'use client'

import Link from '@/components/Link/Link';

import styles from './button.module.scss';

const Button = (props) => {

  if( props.href ){
    return (
      <Link
        href={props.href}
        className={`${styles.button} ${props.icon ? styles.icon : ''} ${props.className}`}
        {...props}
        >
        {props.children}
      </Link>
    );
  } else {
    return (
      <button
        onClick={props.onClick}
        className={`${styles.button} ${props.icon ? styles.icon : ''} ${props.className}`}
        >
        {props.children}
      </button>
    );
  }

}

export default Button;