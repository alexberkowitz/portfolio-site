'use client'

import { useGlobalContext } from '@/GlobalContext';

import styles from './button.module.scss';

const Button = (props) => {
  const globalContext = useGlobalContext();

  return (
    <button
      onClick={props.onClick}
      onMouseEnter={(e) => globalContext.setHover(e, true, props.hoverColor)}
      onMouseLeave={(e) => globalContext.setHover(e, false, props.hoverColor)}
      className={`${styles.button} ${props.className}`}
      >
      {props.children}
    </button>
  );
}

export default Button;