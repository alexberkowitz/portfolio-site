/*-------------------------------------------------------*/
/* HEADER
/*-------------------------------------------------------*/
/**
 * Site title and page border
 */

'use client'

import { useRef, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from '@/components/Link/Link';
import BackButton from './BackButton';
import PageBorder from './PageBorder';
import { includesAny } from '@/utils/utils';
import * as Constants from '@/Constants';

import styles from "./header.module.scss";

const Header = () => {
  const pathname = usePathname();
  const titleRef = useRef(null);
  const backButtonRef = useRef(null);
  const titleIgnoredPages = ["/"]; // Pages on this list won't show the title
  const backButtonIgnoredPages = ["/", "/links"]; // Pages on this list won't show the back button
  const [showTitle, setShowTitle] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowTitle(!includesAny(pathname, titleIgnoredPages));
      setShowBackButton(!includesAny(pathname, backButtonIgnoredPages));
    }, Constants.transitionDuration / 2 * 1000);
  }, [pathname]);
  
  return (
    <div className={styles.header}>
      <div
        ref={titleRef}
        className={`${styles.title} ${showTitle ? styles.show : ''}`}
        >
        <Link href="/" >
          <h1 id="header-title">
            Alex Berkowitz
          </h1>
        </Link>
      </div>
      <BackButton
        styles={styles}
        buttonRef={backButtonRef}
        show={showBackButton}
        />
      <PageBorder
        styles={styles}
        titleRef={titleRef}
        showTitle={showTitle}
        backButtonRef={backButtonRef}
        showBackButton={showBackButton}
        />
    </div>
  );
}

export default Header;