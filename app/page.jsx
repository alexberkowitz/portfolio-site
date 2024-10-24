'use client'

import { useGlobalContext } from '@/GlobalContext';
import styles from './page.module.scss';

export default function Home() {
  const globalContext = useGlobalContext();

  return (
    <main className={styles.homePage}>
      <div className={styles.title}>
        <h1>Alex Berkowitz</h1>
      </div>
      <div className={styles.designer}>
        <a onClick={(e) => globalContext.navigate(e)}>Designer</a>
      </div>
      <div className={styles.developer}>
        <a onClick={(e) => globalContext.navigate(e)}>Developer</a>
      </div>
      <div className={styles.maker}>
        <a onClick={(e) => globalContext.navigate(e)}>Maker</a>
      </div>
    </main>
  );
}
