'use client'

import { useGlobalContext } from '@/GlobalContext';

import styles from './button.module.scss';

const Button = (props) => {
  const globalContext = useGlobalContext();

  return (
    <button
      onClick={props.onClick}
      onMouseEnter={(e) => globalContext.setHoverState(e, true)}
      onMouseLeave={(e) => globalContext.setHoverState(e, false)}
      className={`${styles.button} ${props.icon ? styles.icon : ''} ${props.className}`}
      >
      {props.children}
    </button>
  );
}

export default Button;