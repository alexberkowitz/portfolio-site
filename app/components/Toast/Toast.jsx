/*-------------------------------------------------------*/
/* TOAST
/*-------------------------------------------------------*/

'use client'

import { useState, useEffect } from 'react';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';

import styles from './toast.module.scss';

const Toast = (props) => {
  const [initialized, setInitialized] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if( !initialized && !localStorage.getItem(`toastClosed-${props.id}`) ){
      setTimeout(() => {
        setInitialized(true);
        setOpen(true);
      }, 2000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close the toast permanently
  const closeToast = () => {
    localStorage.setItem(`toastClosed-${props.id}`, true);
    setOpen(false);
  }

  return (
    <div className={styles.toastContainer}>
      <div
        id={`toast-${props.id}`}
        className={`${styles.toast} ${open ? styles.open : ''}`}
        tabIndex={open ? 0 : -1}
        >
        <div className={styles.content}>
          {props.children}
        </div>
        <Button
          onClick={closeToast}
          type="icon"
          >
            <Icon type="close"/>
          </Button>
      </div>
    </div>
  )
}

export default Toast;