/*-------------------------------------------------------*/
/* BACK BUTTON
/*-------------------------------------------------------*/
/* Global back button that appears on (almost) all pages
/*-------------------------------------------------------*/

'use client'

import Link from '@/components/Link/Link';
import { useGlobalContext } from '@/GlobalContext';
import { usePathname } from 'next/navigation';

const BackButton = (props) => {
  const globalContext = useGlobalContext();
  const styles = props.styles;
  const ignoredPages = ["/", "/links"]; // Pages on this list won't show the back button
  
  const showBackButton = ignoredPages.indexOf(usePathname()) === -1;
  
  return (
    <div
      className={`${styles.backButton} ${showBackButton ? styles.show : ''}`}
      ref={props.buttonRef}
      >
      <Link
        href={globalContext.prevRoute}
        >
        <span>
          Go Back
        </span>
      </Link>
    </div>
  );
}

export default BackButton;