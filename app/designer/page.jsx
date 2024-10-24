'use client'

import BackButton from '@/components/BackButton/BackButton';

import styles from './page.module.scss';

export default function Designer() {
  return (
    <main className={styles.designerPage}>
      <BackButton />
      <h1>Designer</h1>
    </main>
  );
}
