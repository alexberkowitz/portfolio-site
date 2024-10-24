'use client'

import { useGlobalContext } from '@/GlobalContext';
import Link from '@/components/Link/Link';
import styles from './page.module.scss';

export default function Home() {
  const globalContext = useGlobalContext();

  return (
    <main className={styles.homePage}>
      <div className={styles.title}>
        <h1>Alex Berkowitz</h1>
      </div>
      <div className={styles.designer}>
        <Link
          href='/designer'
          >
          Designer
        </Link>
      </div>
      <div className={styles.developer}>
        <Link
          href='/developer'
          >
          Developer
        </Link>
      </div>
      <div className={styles.maker}>
        <Link
          href='/maker'
          >
          Maker
        </Link>
      </div>
    </main>
  );
}
