import { MuseoModerno, Oxanium } from "next/font/google";

import GlobalContextContainer from './GlobalContext';
import dynamic from 'next/dynamic';
import Header from '@/components/Header/Header';
import BackButton from '@/components/BackButton/BackButton';
import PageTransition from '@/components/PageTransition/PageTransition';
import * as Constants from '@/Constants';
 
// These need to be imported dynamically because p5.js relies on the window object
const DynamicBackground = dynamic(() => import('@/components/Background/Background'), {
  ssr: false,
});
const DynamicCursor = dynamic(() => import('@/components/Cursor/Cursor'), {
  ssr: false,
});

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

// Metadata
export const metadata = {
  title: "Alex Berkowitz",
  description: "Designer, Developer, Maker"
};

// Viewport
export const viewport = {
  width: "device-width",
  initialScale: 1
}

export default function RootLayout({ children }) {
  return (
    <GlobalContextContainer>
        <html lang="en" style={{
          '--bgColor': `rgb(${Constants.bgColor[0]}, ${Constants.bgColor[1]}, ${Constants.bgColor[2]})`,
          '--fgColor': `rgb(${Constants.fgColor[0]}, ${Constants.fgColor[1]}, ${Constants.fgColor[2]})`,
          '--bodyColor': `rgb(${Constants.bodyColor[0]}, ${Constants.bodyColor[1]}, ${Constants.bodyColor[2]})`,
          '--accentColor': `rgb(${Constants.accentColor[0]}, ${Constants.accentColor[1]}, ${Constants.accentColor[2]})`,
          '--borderWidth': `${Constants.pixelDensity}px`,
          '--transitionDuration': `${Constants.transitionDuration / 2}s`
          }}>
          <body className={`${museoModerno.variable} ${oxanium.variable}`}>
            <DynamicBackground />
            <Header />
              {children}
            <BackButton />
            <PageTransition />
            <DynamicCursor />
          </body>
        </html>
    </GlobalContextContainer>
  );
}