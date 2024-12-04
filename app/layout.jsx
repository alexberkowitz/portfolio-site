import { MuseoModerno, Oxanium } from "next/font/google";
import localFont from 'next/font/local';
import GlobalContextContainer from './GlobalContext';
import Header from '@/components/Header/Header';
import DynamicBackground from '@/components/Background/DynamicBackground';
import DynamicCursor from '@/components/Cursor/DynamicCursor';
import DynamicMarquee from '@/components/Marquee/DynamicMarquee';
import PageTransition from '@/components/PageTransition/PageTransition';
import ScrollBar from '@/components/ScrollBar/ScrollBar';
import * as Constants from '@/Constants';

import "./styles/globals.scss";

// Font definitions
const museoModerno = MuseoModerno({
  subsets: ["latin"],
  variable: '--font-museo-moderno'
});

const oxanium = Oxanium({
  subsets: ["latin"],
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
      style: 'normal',
    },
  ],
  variable: '--font-doto'
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
          <body className={`${museoModerno.variable} ${oxanium.variable} ${doto.variable}`}>
            <DynamicBackground />
            <Header />
            <DynamicMarquee />
            <ScrollBar>
              {children}
            </ScrollBar>
            <PageTransition />
            <DynamicCursor />
          </body>
        </html>
    </GlobalContextContainer>
  );
}