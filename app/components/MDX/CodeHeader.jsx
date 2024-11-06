'use client'

import Icon from '@/components/Icon/Icon';
import Button from '@/components/Button/Button';
import * as Constants from '@/Constants';

import styles from './mdx.module.scss';

const CodeHeader = (props) => {
  const copyText = async function(e) {
    const text = e.target.closest('pre').querySelector('code').innerText;
    await navigator.clipboard.writeText(text);
  }

  const copyButton = () => {
    return (
      <Button
        className={styles.copyButton}
        onClick={(e) => copyText(e)}
        icon={true}
        aria-label="Copy"
        >
        <Icon type="copy"/>
      </Button>
    )
  }
  
  if( !!props.language ){
    return (
      <div className={styles.codeHeader}>
        <p>{props.language}</p>
        {copyButton()}
      </div>
    );
  } else {
    return copyButton()
  }
}

export default CodeHeader;