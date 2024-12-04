'use client'

import { useGlobalContext } from '@/GlobalContext';
import Link from '@/components/Link/Link';
import Toast from '@/components/Toast/Toast';
import DemoButton from '@/components/DemoButton/DemoButton';
import DynamicModelViewer from '@/components/ModelViewer/DynamicModelViewer';
import CircleText from '@/components/CircleText/CircleText';

import styles from './page.module.scss';

export default function Home() {
  const globalContext = useGlobalContext();

  return (
    <>
      <main className={styles.homePage}>
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
          <div className={styles.spacer}></div>
          <li className={styles.maker}>
            <Link
              href='/maker'
              >
              Maker
            </Link>
          </li>
          <li className={styles.person}>
            <Link
              href='/about'
              >
              Person
            </Link>
          </li>
        </ul>

        <div className={styles.heroImage}>
          <div className={styles.circleText}>
            <CircleText text="Alex Berkowitz Alex Berkowitz Alex Berkowitz Alex Berkowitz" border="true" />
          </div>
          <div className={styles.modelViewer}>
            <DynamicModelViewer
              model="/media/head.obj"
              rotationX={90}
              rotationY={0}
              rotationZ={0}
              rotationSpeed={-35}
              rotationAxis="z"
              xInfluence={15}
              yInfluence={0}
              scale={.75}
              dither={true}
              callback={() => {globalContext.setTransition(false)}}
              />
          </div>
        </div>
      </main>
      <Toast id="resume"><small>Want to cut to the chase? Check out my <Link href="/resume">digital résumé</Link>.</small></Toast>
      <DemoButton />
    </>
  );
}
