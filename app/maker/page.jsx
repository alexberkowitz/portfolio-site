'use client'

import BackButton from '@/components/BackButton/BackButton';

import styles from './page.module.scss';

export default function Maker() {
  return (
    <main className={styles.makerPage}>
      <BackButton />
      <h1>Maker</h1>
    </main>
  );
}
