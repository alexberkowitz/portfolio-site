import styles from './pageTitle.module.scss';

const PageTitle = (props) => {
  return (
    <h1 className={styles.pageTitle}>
      {props.children}
      <div className={styles.topCorner}></div>
      <div className={styles.bottomCorner}></div>
    </h1>
  );
}

export default PageTitle;