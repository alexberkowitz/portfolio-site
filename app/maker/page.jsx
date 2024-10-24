'use client'

import { useGlobalContext } from '@/GlobalContext';
import styles from './page.module.scss';

export default function Maker() {
  const globalContext = useGlobalContext();

  return (
    <main className={styles.makerPage}>
      <h1>Maker</h1>
    </main>
  );
}
