'use client'

import Link from '@/components/Link/Link';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.homePage}>
      <div className={styles.title}>
        <h1>Alex<br/>Berkowitz</h1>
      </div>
      <div className={styles.designer}>
        <Link
          href='/designer'
          hoverTarget={true}
          >
          Designer
        </Link>
      </div>
      <div className={styles.developer}>
        <Link
          href='/developer'
          hoverTarget={true}
          >
          Developer
        </Link>
      </div>
      <div className={styles.maker}>
        <Link
          href='/maker'
          hoverTarget={true}
          >
          Maker
        </Link>
      </div>
    </main>
  );
}
