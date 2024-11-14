'use client'

import styles from './button.module.scss';

const Button = (props) => {

  return (
    <button
      onClick={props.onClick}
      className={`${styles.button} ${props.icon ? styles.icon : ''} ${props.className}`}
      >
      {props.children}
    </button>
  );
}

export default Button;