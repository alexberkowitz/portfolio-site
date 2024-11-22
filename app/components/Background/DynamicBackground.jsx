// Dynamic import module for Background component

import dynamic from 'next/dynamic';

const Background = dynamic(() => import('./Background'), {
  ssr: false,
});

const DynamicBackground = (props) => {
  return <Background {...props} />
}

export default DynamicBackground;