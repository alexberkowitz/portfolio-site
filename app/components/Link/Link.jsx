'use client'

import { useGlobalContext } from '@/GlobalContext';

import styles from './link.module.scss';

const Link = (props) => {
  const globalContext = useGlobalContext();

  const isExternal = !props.href.startsWith('/');

  const handleClick = (e) => {
    e.preventDefault();
    globalContext.navigate(props.href);
  };

  return isExternal ? (
    <a
      {...props}
      href={props.href}
      className={`${props.button ? styles.button : ''} ${props.className || ''}`}
      target="_blank"
      rel="noopener noreferrer"
      >
      {props.children}
    </a>
  ) : (
    <a
      {...props}
      onClick={handleClick}
      className={`${props.button ? styles.button : ''} ${props.className || ''}`}
      >
      {props.children}
    </a>
  );
}

export default Link;