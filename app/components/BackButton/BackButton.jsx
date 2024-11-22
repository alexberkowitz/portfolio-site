/*-------------------------------------------------------*/
/* BACK BUTTON
/*-------------------------------------------------------*/
/* Global back button that appears on (almost) all pages
/*-------------------------------------------------------*/

'use client'

import Link from '@/components/Link/Link';
import { useGlobalContext } from '@/GlobalContext';
import { usePathname } from 'next/navigation';

import styles from "./backButton.module.scss";

const BackButton = () => {
  const globalContext = useGlobalContext();
  const ignoredPages = ["/", "/links"]; // Pages on this list won't show the back button
  
  const showBackButton = ignoredPages.indexOf(usePathname()) === -1;
  
  return showBackButton ? (
    <Link
      className={styles.backButton}
      href={globalContext.prevRoute}
      >
      <span>
        Go Back
      </span>
    </Link>
  ) : null;
}

export default BackButton;