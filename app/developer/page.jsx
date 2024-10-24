'use client'

import BackButton from '@/components/BackButton/BackButton';

import styles from './page.module.scss';

export default function Developer() {
  return (
    <main className={styles.developerPage}>
      <BackButton />
      <h1>Developer</h1>
    </main>
  );
}
