/*-------------------------------------------------------*/
/* BACK BUTTON
/*-------------------------------------------------------*/
/* Global back button that appears on (almost) all pages
/*-------------------------------------------------------*/

'use client'

import Link from '@/components/Link/Link';
import { useGlobalContext } from '@/GlobalContext';

const BackButton = (props) => {
  const globalContext = useGlobalContext();
  const styles = props.styles;
  
  return (
    <div
      className={`${styles.backButton} ${props.show ? styles.show : ''}`}
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