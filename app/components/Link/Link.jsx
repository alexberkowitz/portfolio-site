'use client'

import { useGlobalContext } from '@/GlobalContext';

import styles from './link.module.scss';

const Link = (props) => {
  const globalContext = useGlobalContext();
  const target = props.target === undefined || props.target === "true";
  const isExternal = !props.href.startsWith('/');

  return isExternal ? (
    <a
      {...props}
      href={props.href}
      onMouseEnter={(e) => globalContext.setHover(e, true, target)}
      onMouseLeave={(e) => globalContext.setHover(e, false)}
      className={`${styles.link} ${props.className}`}
      target="_blank"
      rel="noopener noreferrer"
      >
      {props.children}
    </a>
  ) : (
    <a
      {...props}
      onClick={(e) => {e.preventDefault(); globalContext.navigate(e, props.href, !!props.incomplete);}}
      onMouseEnter={(e) => globalContext.setHover(e, true, target)}
      onMouseLeave={(e) => globalContext.setHover(e, false)}
      className={`${styles.link} ${props.className}`}
      >
      {props.children}
    </a>
  );
}

export default Link;