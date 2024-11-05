'use client'

import Link from '@/components/Link/Link';

import styles from "./backButton.module.scss";

const BackButton = () => {
  return (
    <Link
      className={styles.backButton}
      href="/"
      hoverTarget={true}
      >
      Go Back
    </Link>
  );
}

export default BackButton;