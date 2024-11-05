import BackButton from '@/components/BackButton/BackButton';
import { Projects } from '@/components/Projects/Projects';

import styles from './page.module.scss';

export default function Developer() {
  return (
    <main className={styles.developerPage}>
      <BackButton />
      <h1>Developer</h1>
      <Projects type="developer"/>
    </main>
  );
}
