'use client'

import { useGlobalContext } from '@/GlobalContext';

import styles from './link.module.scss';

const Link = (props) => {
  const globalContext = useGlobalContext();

  return (
    <a
      onClick={(e) => globalContext.navigate(e, props.href)}
      onMouseEnter={(e) => globalContext.setHover(e, true, props.target)}
      onMouseLeave={(e) => globalContext.setHover(e, false)}
      className={`${styles.link} ${props.className}`}
      >
      {props.children}
    </a>
  );
}

export default Link;