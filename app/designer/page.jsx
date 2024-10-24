'use client'

import { useGlobalContext } from '@/GlobalContext';
import styles from './page.module.scss';

export default function Designer() {
  const globalContext = useGlobalContext();

  return (
    <main className={styles.designerPage}>
      <h1>Designer</h1>
    </main>
  );
}
