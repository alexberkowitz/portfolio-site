/*-------------------------------------------------------*/
/* BUTTON
/*-------------------------------------------------------*/

'use client'

import Link from '@/components/Link/Link';

import styles from './button.module.scss';

const Button = (props) => {
  let buttonClass = styles.button;
  switch( props.type ){
    case 'link':
      buttonClass = styles.link;
      break;

    case 'icon':
      buttonClass = styles.icon;
      break;
  }

  if( props.href ){
    return (
      <Link
        href={props.href}
        className={`${buttonClass} ${props.className}`}
        {...props}
        >
        {props.children}
      </Link>
    );
  } else {
    return (
      <button
        onClick={props.onClick}
        className={`${buttonClass} ${props.className}`}
        >
        {props.children}
      </button>
    );
  }

}

export default Button;