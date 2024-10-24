'use client'

import { useGlobalContext } from '@/GlobalContext';

import styles from "./backButton.module.scss";

const BackButton = () => {
  const globalContext = useGlobalContext();

  return (
    <a
      className={styles.backButton}
      onClick={(e) => globalContext.navigate(e, '/')}
      >
      Go Back
    </a>
  );
}

export default BackButton;