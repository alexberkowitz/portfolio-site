'use client'

import { useGlobalContext } from '@/GlobalContext';
// import { useTransitionRouter } from 'next-view-transitions';
// import { useRouter } from 'next/router';
// import { usePathname } from "next/navigation";

import styles from './link.module.scss';

const Link = (props) => {

  const globalContext = useGlobalContext();
  // const router = useRouter();
  // const pathname = usePathname();

  const isExternal = !props.href.startsWith('/');

  const handleClick = (e) => {
    e.preventDefault();
    globalContext.navigate(props.href);
    // globalContext.setPrevRoute(pathname.startsWith('/projects') ? '/' : pathname);
    // router.push(props.href);
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