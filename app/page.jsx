'use client'

import Link from '@/components/Link/Link';
import Toast from '@/components/Toast/Toast';
import DemoButton from '@/components/DemoButton/DemoButton';
import dynamic from 'next/dynamic';

import styles from './page.module.scss';

const DynamicModelView = dynamic(() => import('@/components/ModelView/ModelView'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <main className={styles.homePage}>
        <h1 className={styles.title}>Alex<br/>Berkowitz</h1>
        
        <ul className={styles.links}>
          <li className={styles.designer}>
            <Link
              href='/designer'
              >
              Designer
            </Link>
          </li>
          <li className={styles.developer}>
            <Link
              href='/developer'
              >
              Developer
            </Link>
          </li>
          <li className={styles.maker}>
            <Link
              href='/maker'
              >
              Maker
            </Link>
          </li>
        </ul>

        <div className={styles.modelView}>
          <DynamicModelView
            model="/media/logo.obj"
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
      <Toast id="resume"><small>Want to cut to the chase? Check out my <Link href="/resume">digital résumé</Link>.</small></Toast>
      <DemoButton />
    </>
  );
}
