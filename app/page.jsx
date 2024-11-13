'use client'

import Link from '@/components/Link/Link';
import TestButton from '@/components/TestButton/TestButton';
import dynamic from 'next/dynamic';

import styles from './page.module.scss';

const DynamicModelView = dynamic(() => import('@/components/ModelView/ModelView'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
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
          <DynamicModelView
            model="/3d/logo.obj"
            rotationX={0}
            rotationY={180}
            rotationZ={180}
            rotationSpeed={15}
            xInfluence={90}
            yInfluence={90}
            scale={3}
            dither={true}
            />
        </div>
      </main>
      <TestButton />
    </>
  );
}
