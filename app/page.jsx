'use client'

import Link from '@/components/Link/Link';
import dynamic from 'next/dynamic';

import styles from './page.module.scss';

const DynamicModelView = dynamic(() => import('@/components/ModelView/ModelView'), {
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
        <DynamicModelView
          model="/3d/sword/sword.obj"
          options={{
            texture: "/3d/sword/sword_diffuse.png",
            solid: true,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 45,
            scale: 4
          }}/>
      </div>
    </main>
  );
}
