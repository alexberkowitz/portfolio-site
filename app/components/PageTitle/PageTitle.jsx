import styles from './pageTitle.module.scss';

const PageTitle = (props) => {
  return (
    <>
      <h1 className={styles.pageTitle}>
        {props.children}
        <div className={styles.topCorner}></div>
        <div className={styles.bottomCorner}></div>
      </h1>
      <div className={styles.spacer} tabIndex="-1">{props.children}</div>
    </>
  );
}

export default PageTitle;