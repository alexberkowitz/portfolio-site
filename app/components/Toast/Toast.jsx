/*-------------------------------------------------------*/
/* TOAST
/*-------------------------------------------------------*/
/* Banner-style info popup
/*-------------------------------------------------------*/

'use client'

import { useState, useEffect } from 'react';
import { useGlobalContext } from '@/GlobalContext';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';

import styles from './toast.module.scss';

const Toast = (props) => {
  const globalContext = useGlobalContext();
  const [initialized, setInitialized] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if( !initialized ){
      setInitialized(true);

      if( !localStorage.getItem(`toastClosed-${props.id}`) ){
        setTimeout(() => {
          setOpen(true);
        }, 2000);
      }
    }
  }, []);

  // Close the toast on page change
  useEffect(() => {
    if( globalContext.transition ){
      setOpen(false);
    }
  }, [globalContext.transition]);

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
          icon
          >
            <Icon type="close"/>
          </Button>
      </div>
    </div>
  )
}

export default Toast;