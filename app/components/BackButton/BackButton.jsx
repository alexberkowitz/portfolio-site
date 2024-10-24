'use client'

import { useGlobalContext } from '@/GlobalContext';
import Link from '@/components/Link/Link';

import styles from "./backButton.module.scss";

const BackButton = () => {
  const globalContext = useGlobalContext();

  return (
    <Link
      className={styles.backButton}
      href="/"
      >
      Go Back
    </Link>
  );
}

export default BackButton;