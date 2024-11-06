'use client'

import Link from '@/components/Link/Link';
import { useGlobalContext } from '@/GlobalContext';

import styles from "./backButton.module.scss";

const BackButton = () => {
  const globalContext = useGlobalContext();
  
  return (
    <Link
      className={styles.backButton}
      href={globalContext.prevRoute}
      target={true}
      >
      Go Back
    </Link>
  );
}

export default BackButton;