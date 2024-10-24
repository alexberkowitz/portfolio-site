'use client'

import { useGlobalContext } from '@/GlobalContext';

const Link = (props) => {
  const globalContext = useGlobalContext();

  return (
    <a
      onClick={(e) => globalContext.navigate(e, props.href)}
      onMouseEnter={(e) => globalContext.setHover(e, true)}
      onMouseLeave={(e) => globalContext.setHover(e, false)}
      className={props.className}
      >
      {props.children}
    </a>
  );
}

export default Link;