'use client'

import PageTitle from '@/components/PageTitle/PageTitle';
import dynamic from 'next/dynamic';
import Icon from '@/components/Icon/Icon';
import * as Constants from '@/Constants';

const DynamicModelView = dynamic(() => import('@/components/ModelView/ModelView'), {
  ssr: false,
});

export default function Test() {

  return (
    <main>
      <PageTitle>Tests</PageTitle>
      <p>
        <span class="text">
          You've found my super-secret test page! This is where I test the reusable components found throughout the site. Feel free to play around!
        </span>
      </p>

      <div>
        <h2><span class="text">Icons</span></h2>
        <div style={{
          display: 'flex',
          gap: 32,
          padding: 16,
          backgroundColor: `rgba(${Constants.accentColor[0]},${Constants.accentColor[1]},${Constants.accentColor[2]},${Constants.accentColor[3]})`,
          borderRadius: 8
        }}>
          <Icon type="copy"/>
        </div>
      </div>

      <div>
        <h2><span class="text">3D Model Viewer</span></h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat( auto-fit, minmax(500px, 1fr) )',
          gap: 32
        }}>
          <div>
            <h3><span class="text">Dithered model with mouse influence</span></h3>
            <div style={{width: '100%', height: 400}}>
              <DynamicModelView
                model="/media/logo.obj"
                rotationX={0}
                rotationY={180}
                rotationZ={180}
                rotationSpeed={0}
                xInfluence={90}
                yInfluence={90}
                scale={1}
                dither={true}
                />
            </div>
          </div>

          <div>
            <h3><span class="text">Clean model with static rotation</span></h3>
            <div style={{width: '100%', height: 400}}>
              <DynamicModelView
                model="/media/logo.obj"
                rotationX={0}
                rotationY={180}
                rotationZ={180}
                rotationSpeed={30}
                xInfluence={0}
                yInfluence={0}
                scale={1}
                dither={false}
                />
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
