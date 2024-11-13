import styles from './pageTitle.module.scss';

const PageTitle = (props) => {
  return (
    <>
      <h1 className={styles.pageTitle}>
        {props.children}
      </h1>
      <div className={styles.spacer} tabIndex="-1">{props.children}</div>
    </>
  );
}

export default PageTitle;