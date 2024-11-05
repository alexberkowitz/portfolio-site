'use client'

import { useGlobalContext } from '@/GlobalContext';

import styles from './link.module.scss';

const Link = (props) => {
  const globalContext = useGlobalContext();

  return (
    <a
      onClick={(e) => globalContext.navigate(e, props.href)}
      onMouseEnter={props.hoverTarget === true ? (e) => globalContext.setHover(e, true) : null}
      onMouseLeave={props.hoverTarget === true ? (e) => globalContext.setHover(e, false) : null}
      className={`${styles.link} ${props.className}`}
      >
      {props.children}
    </a>
  );
}

export default Link;