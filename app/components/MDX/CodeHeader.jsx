/*-------------------------------------------------------*/
/* CODE HEADER
/*-------------------------------------------------------*/
/* Header for <pre> elements that shows language
/* and a copy button
/*-------------------------------------------------------*/

'use client'

import { useState } from 'react';
import Icon from '@/components/Icon/Icon';
import Button from '@/components/Button/Button';

import styles from './mdx.module.scss';

const CodeHeader = (props) => {
  const [success, setSuccess] = useState(false);
  const successAnimDuration = 2; // Seconds

  const copyText = async function(e) {
    const text = e.target.closest('pre').querySelector('code').innerText;
    await navigator.clipboard.writeText(text);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false)
    }, successAnimDuration * 1000);
  }

  const copyButton = () => {
    return (
      <Button
        className={`${styles.copyButton} ${success ? styles.success : ''}`}
        onClick={(e) => copyText(e)}
        icon={true}
        aria-label="Copy"
        >
        <Icon type="copy" />
      </Button>
    )
  }
  
  if( !!props.language ){
    return (
      <div
        className={styles.codeHeader}
        style={{
          '--duration': `${successAnimDuration}s`
        }}
        >
        <p>{props.language}</p>
        {copyButton()}
      </div>
    );
  } else {
    return copyButton()
  }
}

export default CodeHeader;