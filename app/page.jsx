import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.homePage}>
      <div className={styles.title}>
        <h1>Alex Berkowitz</h1>
      </div>
      <div className={styles.designer}>
        <a>Designer</a>
      </div>
      <div className={styles.developer}>
        <a>Developer</a>
      </div>
      <div className={styles.maker}>
        <a>Maker</a>
      </div>
    </main>
  );
}
