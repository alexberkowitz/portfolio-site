import styles from './icon.module.scss';

const Icon = (props) => {
  switch( props.type ){
    case 'copy':
      return (
        <svg {...props} className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <polyline points="11.5 4.5 14.5 4.5 14.5 14.5 5.5 14.5 5.5 11.5" style={{stroke: 'var(--bodyColor)', fill: 'none'}}/>
          <polygon points="1.5 5.5 1.5 11.5 11.5 11.5 11.5 1.5 5.5 1.5 5.5 5.5 1.5 5.5" style={{stroke: 'var(--bodyColor)', fill: 'none'}}/>
          <rect x="2" y="4" width="1" height="1" style={{fill: 'var(--bodyColor)'}}/>
          <rect x="3" y="3" width="1" height="1" style={{fill: 'var(--bodyColor)'}}/>
          <rect x="4" y="2" width="1" height="1" style={{fill: 'var(--bodyColor)'}}/>
          <line x1="6.5" y1="3.5" x2="9.5" y2="3.5" style={{stroke: 'var(--fgColor)'}}/>
          <line x1="6.5" y1="5.5" x2="9.5" y2="5.5" style={{stroke: 'var(--fgColor)'}}/>
          <line x1="3.5" y1="7.5" x2="9.5" y2="7.5" style={{stroke: 'var(--fgColor)'}}/>
          <line x1="3.5" y1="9.5" x2="9.5" y2="9.5" style={{stroke: 'var(--fgColor)'}}/>
        </svg>
      )
      break;
  }
}

export default Icon;