import localFont from 'next/font/local';
import GlobalContextContainer from './GlobalContext';
import Header from '@/components/Header/Header';
import DynamicBackground from '@/components/Background/DynamicBackground';
import DynamicCursor from '@/components/Cursor/DynamicCursor';
import DynamicMarquee from '@/components/Marquee/DynamicMarquee';
import PageTransition from '@/components/PageTransition/PageTransition';
import ScrollBar from '@/components/ScrollBar/ScrollBar';
import Toast from '@/components/Toast/Toast';
import Link from '@/components/Link/Link';
import * as Constants from '@/Constants';

import "./styles/globals.scss";

// Font definitions
const museoModerno = localFont({
  src: [
    {
      path: 'fonts/museomoderno/MuseoModerno-VariableFont_wght.ttf',
      weight: '200',
      style: 'normal',
    },
  ],
  variable: '--font-museo-moderno'
});

const oxanium = localFont({
  src: [
    {
      path: 'fonts/oxanium/Oxanium-VariableFont_wght.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-oxanium'
});

const doto = localFont({
  src: [
    {
      path: 'fonts/doto/Doto-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: 'fonts/doto/Doto-Black.ttf',
      weight: '800',
      style: 'black',
    },
  ],
  variable: '--font-doto'
});

const dotoRounded = localFont({
  src: [
    {
      path: 'fonts/doto/Doto_Rounded-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-doto-rounded'
});

// Metadata
export const metadata = {
  title: "Alex Berkowitz",
  description: "Designer, Developer, Maker"
};

// Viewport
export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  targetDensityDpi: 'device-dpi'
}

export default function RootLayout({ children }) {
  // Setting CSS variables allow us to easily keep JS and CSS in-sync.
  // It also makes consistency between components easier.
  // The trade-off is that components are less isolated--copying them
  // to another project would require some decoupling. But the
  // benefits are worth it IMO.
  const variables = {
    '--bgColor': `rgb(${Constants.bgColor[0]}, ${Constants.bgColor[1]}, ${Constants.bgColor[2]})`,
    '--fgColor': `rgb(${Constants.fgColor[0]}, ${Constants.fgColor[1]}, ${Constants.fgColor[2]})`,
    '--bodyColor': `rgb(${Constants.bodyColor[0]}, ${Constants.bodyColor[1]}, ${Constants.bodyColor[2]})`,
    '--accentColor': `rgb(${Constants.accentColor[0]}, ${Constants.accentColor[1]}, ${Constants.accentColor[2]})`,
    '--borderWidth': `${Constants.pixelDensity}px`,
    '--transitionDuration': `${Constants.transitionDuration / 2}s`,
    '--titleDuration': `${Constants.titleDuration}s`
  };

  return (
    <GlobalContextContainer>
        <html lang="en" style={variables}>
          <body className={`${museoModerno.variable} ${oxanium.variable} ${doto.variable} ${dotoRounded.variable}`}>
            <DynamicBackground />
            <Header />
            <DynamicMarquee />
            <ScrollBar>
              {children}
              <Toast id="resume"><small>Want to cut to the chase? Check out my <Link href="/resume">digital résumé</Link>.</small></Toast>
            </ScrollBar>
            <PageTransition />
            <DynamicCursor />
          </body>
        </html>
    </GlobalContextContainer>
  );
}