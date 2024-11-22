// Dynamic import module for Cursor component

import dynamic from 'next/dynamic';

const Cursor = dynamic(() => import('./Cursor'), {
  ssr: false,
});

const DynamicCursor = (props) => {
  return <Cursor {...props} />
}

export default DynamicCursor;