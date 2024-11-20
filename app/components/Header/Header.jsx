'use client'

import { useRef } from 'react';
import Link from '@/components/Link/Link';
import { usePathname } from 'next/navigation';
import PageBorder from './PageBorder';

import styles from "./header.module.scss";

const Header = () => {
  const titleRef = useRef(null);
  const ignoredPages = ["/"]; // Pages on this list won't show the title
  
  const showTitle = ignoredPages.indexOf(usePathname()) === -1;
  
  return (
    <div className={styles.header}>
      <div
        ref={titleRef}
        className={`${styles.title} ${showTitle && styles.show}`}
        >
        <Link href="/" >
          <h1 id="header-title">
            Alex Berkowitz
          </h1>
        </Link>
      </div>
      <PageBorder styles={styles} titleRef={titleRef} showTitle={showTitle}/>
    </div>
  );
}

export default Header;