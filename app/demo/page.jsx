'use client'

import PageTitle from '@/components/PageTitle/PageTitle';
import Text from '@/components/Text/Text';
import Icon, { icons } from '@/components/Icon/Icon';
import Link from '@/components/Link/Link';
import Button from '@/components/Button/Button';
import CircleText from '@/components/CircleText/CircleText';
import DynamicModelViewer from '@/components/ModelViewer/DynamicModelViewer';

import styles from './page.module.scss';

export default function Test() {

  return (
    <main className={styles.demoPage}>
      <PageTitle>Demos</PageTitle>
      <p>
        <Text>
          YouI&lsquo;veve found my &ldquo;super secret&rdquo; demo page! This is where I test the reusable components found throughout the site. Feel free to play around!
        </Text>
        <br/><br/>
        <Text>
          Btw, you can find the source code for this site <Link href="https://github.com/alexberkowitz/portfolio-site" target="_blank">here</Link>.
        </Text>
      </p>

      <div className={styles.demoSection}>
        <h2><Text>Circle text</Text></h2>
        <div style={{
          display: 'flex',
          gap: '2rem'
        }}>
          <div style={{flexGrow: 1, aspectRatio: '1 / 1'}}>
            <CircleText text="lorem ipsum dolor sit amet" />
          </div>
          <div style={{flexGrow: 1, aspectRatio: '1 / 1'}}>
            <CircleText text="lorem ipsum" />
          </div>
          <div style={{flexGrow: 1, aspectRatio: '1 / 1'}}>
            <CircleText text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue est luctus lacinia euismod." />
          </div>
        </div>
      </div>

      <div className={styles.demoSection}>
        <h2><Text>Icons</Text></h2>
        <p><Text>There aren&lsquo;t many icons in use on this site, but the ones that are present are entirely custom.</Text></p>
        <div style={{
          alignSelf: 'flex-start',
          display: 'flex',
          gap: '2rem',
          padding: '2rem',
          backgroundColor: 'var(--accentColor)',
          borderRadius: 'var(--cornerRadius)'
          }}>
          {Object.keys(icons).map((key, index) => (
            <Icon key={index} type={key}/>
          ))}
        </div>
      </div>

      <div className={styles.demoSection}>
        <h2><Text>Text</Text></h2>
        <p><Text>
          A custom {"<Text>"} component is used throughout the site. At a basic level, it provides a background color to ensure legibility against the site BG.
          <br/><br/>
          But the wrapper can also be used for special effects such as <Text type="emphasis">emphasis</Text> and <Text type="accent">accented backgrounds</Text>.
        </Text></p>
      </div>

      <div className={styles.demoSection}>
        <h2><Text>Buttons and Links</Text></h2>
        <p><Text>All navigation links on the site use a custom {"<Link>"} component. This component has no default styling, and hooks into a global <Text type="accent">navigate()</Text> function to enable transitions.</Text></p>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem'}}>
          <Link href="#"><Text>Here&lsquo;s a link</Text></Link>
          <Button>And here&lsquo;s a button</Button>
        </div>
      </div>

      <div className={styles.demoSection}>
        <h2><Text>Cursor</Text></h2>
        <p><Text>The cursor on my site is custom-built with p5.js.<br/>Try hovering over this text, or perhaps <Link href="#">this link</Link>!</Text></p>
      </div>

      <div className={styles.demoSection}>
        <h2><Text>Projects</Text></h2>
        <p><Text>Project case study pages are written using Markdown and rendered with MDX. They have their own custom components and layouts that differ from other pages. To test those pages, a test project was created that is only accessible by direct link. If you&lsquo;re interested, you can <Link href="/projects/test">check out the test project</Link>.</Text></p>
      </div>

      

      <div className={styles.demoSection}>
        <h2><Text>3D Model Viewer</Text></h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat( auto-fit, minmax(500px, 1fr) )',
          gap: 32
        }}>
          <div>
            <h3><Text>Dithered model with heavy mouse influence and no static rotation</Text></h3>
            <div style={{width: 400, height: 400}}>
              <DynamicModelViewer
                model="/media/logo.obj"
                rotationX={0}
                rotationY={0}
                rotationZ={0}
                rotationSpeed={0}
                xInfluence={10}
                yInfluence={10}
                scale={.75}
                dither={true}
                />
            </div>
          </div>

          <div>
            <h3><Text>Clean model with static rotation and subtle mouse influence</Text></h3>
            <div style={{width: 400, height: 400}}>
              <DynamicModelViewer
                model="/media/logo.obj"
                rotationX={0}
                rotationY={0}
                rotationZ={0}
                rotationSpeed={30}
                xInfluence={1}
                yInfluence={0}
                scale={.75}
                dither={false}
                />
            </div>
          </div>
        </div>
      </div>

      <div style={{
        height: 'calc(100vh - (6 * var(--gap)))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
        }}>
        <p>This big blank area helps me test the background effects. Try moving your cursor (or finger) around on the screen and clicking (or tapping).</p>
      </div>

    </main>
  );
}
