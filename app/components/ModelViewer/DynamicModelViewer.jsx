// Dynamic import module for ModelViewer component

import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('./ModelViewer'), {
  ssr: false,
});

const DynamicModelViewer = (props) => {
  return <ModelViewer {...props} />
}

export default DynamicModelViewer;