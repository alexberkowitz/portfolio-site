import BackButton from '@/components/BackButton/BackButton';
import { Projects } from '@/components/Projects/Projects';

import styles from './page.module.scss';

export default function Maker() {
  return (
    <main className={styles.makerPage}>
      <BackButton />
      <h1>Maker</h1>
      <Projects type="maker"/>
    </main>
  );
}
