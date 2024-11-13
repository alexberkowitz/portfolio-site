'use client'

import Link from '@/components/Link/Link';

import styles from "./testButton.module.scss";

const TestButton = () => {
  return (
    <Link
      className={styles.testButton}
      href='/test'
      aria-title="Test"
      >
      {'</>'}
    </Link>
  );
}

export default TestButton;            