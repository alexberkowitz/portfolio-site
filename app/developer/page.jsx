'use client'

import { useGlobalContext } from '@/GlobalContext';
import styles from './page.module.scss';

export default function Developer() {
  const globalContext = useGlobalContext();

  return (
    <main className={styles.developerPage}>
      <h1>Developer</h1>
    </main>
  );
}
