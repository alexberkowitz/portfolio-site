// Dynamic import module for Marquee component

import dynamic from 'next/dynamic';

const Marquee = dynamic(() => import('./Marquee'), {
  ssr: false,
});

const DynamicMarquee = (props) => {
  return <Marquee {...props} />
}

export default DynamicMarquee;