'use client'

import Text from '@/components/Text/Text';
import Button from '@/components/Button/Button';
import DynamicModelViewer from '@/components/ModelViewer/DynamicModelViewer';

export default function NotFound() {
  return (
    <main style={{flexGrow: 1, width: '100%', height: '100%', textAlign: 'center', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{height: 400, width: '100%'}}>
        <DynamicModelViewer
          text="ERROR 404"
          rotationX={0}
          rotationY={0}
          rotationZ={0}
          rotationSpeed={0}
          xInfluence={45}
          yInfluence={45}
          scale={15}
          dither={true}
          />
      </div>
      <p style={{textWrap: 'balance'}}>
        <Text>Looks like you&apos;ve found yourself in a bit of a pickle! No worries; let&apos;s get you back on track.</Text>
      </p>
      <Button href="/">Take me back</Button>
    </main>
  );
}
