import dynamic from 'next/dynamic';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';

const DynamicModelView = dynamic(() => import('@/components/ModelView/ModelView'), {
  ssr: false,
});

export default function Test() {
  return (
    <main>
      <h1>Test</h1>
      <p>
        This page is used as a test for the components on my site. Feel free to play around! 
      </p>

      <h2>Projects List</h2>
      <ProjectsList type="maker"/>

      <h2>3D Model Viewer</h2>
      <div style={{width: '100%', height: 400}}>
        <DynamicModelView
          model="/3d/logo.obj"
          rotationX={0}
          rotationY={180}
          rotationZ={180}
          rotationSpeed={15}
          xInfluence={90}
          yInfluence={90}
          scale={3}
          />
      </div>
    </main>
  );
}
