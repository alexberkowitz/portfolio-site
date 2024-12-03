/*-------------------------------------------------------*/
/* DEMO BUTTON
/*-------------------------------------------------------*/
/**
 * Tiny, subtle button that links to demo page
 */

'use client'

import Link from '@/components/Link/Link';

import styles from "./demoButton.module.scss";

const DemoButton = () => {
  return (
    <Link
      className={styles.demoButton}
      href='/demo'
      title="View demo page"
      >
      {'</>'}
    </Link>
  );
}

export default DemoButton;            