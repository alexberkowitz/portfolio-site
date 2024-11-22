/*-------------------------------------------------------*/
/* HEADER
/*-------------------------------------------------------*/
/* Site title and page border
/*-------------------------------------------------------*/

'use client'

import { useRef } from 'react';
import Link from '@/components/Link/Link';
import { usePathname } from 'next/navigation';
import PageBorder from './PageBorder';

import styles from "./header.module.scss";

export const showSiteTitle = () => {
  const ignoredPages = ["/"]; // Pages on this list won't show the title
  return ignoredPages.indexOf(usePathname()) === -1;
}

const Header = () => {
  const titleRef = useRef(null);
  
  return (
    <div className={styles.header}>
      <div
        ref={titleRef}
        className={`${styles.title} ${showSiteTitle() && styles.show}`}
        >
        <Link href="/" >
          <h1 id="header-title">
            Alex Berkowitz
          </h1>
        </Link>
      </div>
      <PageBorder styles={styles} titleRef={titleRef} showTitle={showSiteTitle()}/>
    </div>
  );
}

export default Header;