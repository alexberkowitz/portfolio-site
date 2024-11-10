'use client'

import Link from '@/components/Link/Link';
import dynamic from 'next/dynamic';

import styles from './page.module.scss';

const DynamicModel = dynamic(() => import('@/components/ModelView/ModelView'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className={styles.homePage}>
      <div className={styles.title}>
        <h1>Alex<br/>Berkowitz</h1>
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
      <div className={styles.modelView}>
        <DynamicModel model="/meshes/teapot.obj"/>
      </div>
    </main>
  );
}
