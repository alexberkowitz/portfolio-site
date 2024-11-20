'use client'

import { useGlobalContext } from '@/GlobalContext';

import styles from './pageTransition.module.scss';

const PageTransition = (props) => {
  const globalContext = useGlobalContext();

  return (
    <div
      className={`${styles.pageTransition} ${globalContext.transition ? styles.active : ''}`}
      ></div>
  );
}

export default PageTransition;