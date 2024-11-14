'use client'

import dynamic from 'next/dynamic';
import TextWrapper from '@/components/TextWrapper/TextWrapper';
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
        <TextWrapper>{"Looks like you've found yourself in a bit of a pickle! No worries; let's get you back on track."}</TextWrapper>
      </p>
      <Link href="/" button>Take me back</Link>
    </main>
  );
}
