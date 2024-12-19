/*-------------------------------------------------------*/
/* ICON
/*-------------------------------------------------------*/

import styles from './icon.module.scss';

export const icons = {
  close: (
    <>
      <line x1="1" y1="1" x2="15" y2="15" style={{stroke: 'var(--secondaryColor)', strokeWidth: 'var(--borderWidth'}} vectorEffect="non-scaling-stroke"/>
      <line x1="1" y1="15" x2="15" y2="1" style={{stroke: 'var(--secondaryColor)', strokeWidth: 'var(--borderWidth'}} vectorEffect="non-scaling-stroke"/>
    </>
  ),
  copy: (
    <>
      <polyline points="11.5 4.5 14.5 4.5 14.5 14.5 5.5 14.5 5.5 11.5" style={{stroke: 'var(--primaryColor)', fill: 'none'}}/>
      <polygon points="1.5 5.5 1.5 11.5 11.5 11.5 11.5 1.5 5.5 1.5 5.5 5.5 1.5 5.5" style={{stroke: 'var(--primaryColor)', fill: 'none'}}/>
      <rect x="2" y="4" width="1" height="1" style={{fill: 'var(--primaryColor)'}}/>
      <rect x="3" y="3" width="1" height="1" style={{fill: 'var(--primaryColor)'}}/>
      <rect x="4" y="2" width="1" height="1" style={{fill: 'var(--primaryColor)'}}/>
      <line x1="6.5" y1="3.5" x2="9.5" y2="3.5" style={{stroke: 'var(--secondaryColor)'}}/>
      <line x1="6.5" y1="5.5" x2="9.5" y2="5.5" style={{stroke: 'var(--secondaryColor)'}}/>
      <line x1="3.5" y1="7.5" x2="9.5" y2="7.5" style={{stroke: 'var(--secondaryColor)'}}/>
      <line x1="3.5" y1="9.5" x2="9.5" y2="9.5" style={{stroke: 'var(--secondaryColor)'}}/>
    </>
  ),
  logo: (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100">
      <path d="M96.6,13.5L68.9.5c-1.5-.7-3.2-.7-4.7,0L3.1,28.9c-2,.9-3.2,2.9-3.2,5v47.4c0,2.2,1.2,4.1,3.2,5l27.8,13.1c1.5.7,3.2.7,4.7,0l61.1-28.5c2-.9,3.2-2.9,3.2-5V18.5c0-2.2-1.3-4.1-3.2-5ZM7,33.2L59,8.9c.9-.4,2,.2,2,1.3v23.6c0,1.1-.6,2.1-1.6,2.5l-18.6,8.7c-.9.4-2-.2-2-1.3v-17c0-1-1.1-1.7-2-1.3l-7.5,3.5c-1,.5-1.6,1.4-1.6,2.5v17.9c0,1.1-.6,2.1-1.6,2.5l-18.6,8.7c-.9.4-2-.2-2-1.3v-23.6c0-1.1.6-2.1,1.6-2.5ZM92.7,66.7l-52,24.2c-.9.4-2-.2-2-1.3v-23.6c0-1.1.6-2.1,1.6-2.5l18.6-8.7c.9-.4,2,.2,2,1.3v17c0,1,1.1,1.7,2,1.3l7.5-3.5c1-.5,1.6-1.4,1.6-2.5v-17.9c0-1.1.6-2.1,1.6-2.5l18.6-8.7c.9-.4,2,.2,2,1.3v23.6c0,1.1-.6,2.1-1.6,2.5ZM92.7,33l-63.5,29.6c-1,.5-1.6,1.4-1.6,2.5v24.4c0,1-1.1,1.7-2,1.3l-18.6-8.7c-1-.5-1.6-1.4-1.6-2.5v-10.2c0-1.1.6-2.1,1.6-2.5l63.5-29.6c1-.5,1.6-1.4,1.6-2.5V10.3c0-1,1.1-1.7,2-1.3l18.6,8.7c1,.5,1.6,1.4,1.6,2.5v10.2c0,1.1-.6,2.1-1.6,2.5Z"/>
    </svg>
  )
};

const Icon = (props) => {
  return (
    <svg {...props} className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      {icons[props.type]}
    </svg>
  );
}

export default Icon;