/*-------------------------------------------------------*/
/* HEADER
/*-------------------------------------------------------*/
/* Site title and page border
/*-------------------------------------------------------*/

'use client'

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from '@/components/Link/Link';
import PageBorder from './PageBorder';
import { includesAny } from '@/utils/utils';

import styles from "./header.module.scss";

const Header = () => {
  const titleRef = useRef(null);
  const ignoredPages = ["/"]; // Pages on this list won't show the title
  const showSiteTitle =  !includesAny(usePathname(), ignoredPages);
  
  return (
    <div className={styles.header}>
      <div
        ref={titleRef}
        className={`${styles.title} ${showSiteTitle ? styles.show : ''}`}
        >
        <Link href="/" >
          <h1 id="header-title">
            Alex Berkowitz
          </h1>
        </Link>
      </div>
      <PageBorder styles={styles} titleRef={titleRef} showTitle={showSiteTitle}/>
    </div>
  );
}

export default Header;