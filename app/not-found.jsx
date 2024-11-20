'use client'

import dynamic from 'next/dynamic';
import Text from '@/components/Text/Text';
import Link from '@/components/Link/Link';

const DynamicModelView = dynamic(() => import('@/components/ModelView/ModelView'), {
  ssr: false,
});

export default function NotFound() {
  return (
    <main style={{flexGrow: 1, width: '100%', height: '100%', textAlign: 'center', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{height: 300, width: '100%'}}>
        <DynamicModelView
          text="ERROR 404"
          rotationX={0}
          rotationY={0}
          rotationZ={0}
          rotationSpeed={0}
          xInfluence={45}
          yInfluence={45}
          scale={20}
          dither={true}
          />
      </div>
      <p style={{textWrap: 'balance'}}>
        <Text>Looks like you&lsquo;ve found yourself in a bit of a pickle! No worries; let&lsquo;s get you back on track.</Text>
      </p>
      <Link href="/" button>Take me back</Link>
    </main>
  );
}
