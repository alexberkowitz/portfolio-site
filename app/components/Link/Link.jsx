'use client'

import { useGlobalContext } from '@/GlobalContext';
import { useTransitionRouter } from 'next-view-transitions';
import { usePathname } from "next/navigation";

import styles from './link.module.scss';

const Link = (props) => {

  const globalContext = useGlobalContext();
  const router = useTransitionRouter();
  const pathname = usePathname();

  const isExternal = !props.href.startsWith('/');

  const handleClick = (e) => {
    e.preventDefault();
    globalContext.setPrevRoute(pathname.startsWith('/projects') ? '/' : pathname);
    router.push(props.href);
  };

  return isExternal ? (
    <a
      {...props}
      href={props.href}
      onMouseEnter={(e) => globalContext.setHoverState(e, true)}
      onMouseLeave={(e) => globalContext.setHoverState(e, false)}
      className={`${styles.link} ${props.button ? styles.button : ''} ${props.className}`}
      target="_blank"
      rel="noopener noreferrer"
      >
      {props.children}
    </a>
  ) : (
    <a
      {...props}
      onClick={handleClick}
      onMouseEnter={(e) => globalContext.setHoverState(e, true)}
      onMouseLeave={(e) => globalContext.setHoverState(e, false)}
      className={`${styles.link} ${props.button ? styles.button : ''} ${props.className}`}
      >
      {props.children}
    </a>
  );
}

export default Link;