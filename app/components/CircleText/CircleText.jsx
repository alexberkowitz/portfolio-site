/*-------------------------------------------------------*/
/* CIRCLE TEXT
/*-------------------------------------------------------*/
/**
 * Writes text in a circle
 */

'use client'

import styles from './circleText.module.scss';

const CircleText = (props) => {

  const text = props.text + ' ';

  return (
    <div className={styles.circleText} {...props}>
      <p
        className={styles.textContainer}
        style={{
          '--charCount': text.length
        }}
        >
        {Array.from(text).map((character, index) => (
          <span
            key={index}
            tabIndex={index === 0 ? '0' : '-1'}
            style={{
              '--i': index
            }}
            >
            {character}
          </span>
        ))}
      </p>
    </div>
  );
}

export default CircleText;