import { MuseoModerno, Oxanium } from "next/font/google";

import GlobalContextContainer from './GlobalContext';
import dynamic from 'next/dynamic'
 
// These need to be imported dynamically because p5.js relies on the window object
const DynamicBackground = dynamic(() => import('@/components/Background/Background'), {
  ssr: false,
});
const DynamicOverlay = dynamic(() => import('@/components/Overlay/Overlay'), {
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

const bgColor = [219, 216, 206, 255];
const fgColor = [255, 43, 6, 255];
const bodyColor = [0, 0, 0, 255];
const accentColor = [19, 43, 255, 255];
const pixelDensity = 2;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GlobalContextContainer>
        <body className={`${museoModerno.variable} ${oxanium.variable}`} style={{
          '--bgColor': `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`,
          '--fgColor': `rgb(${fgColor[0]}, ${fgColor[1]}, ${fgColor[2]})`,
          '--bodyColor': `rgb(${bodyColor[0]}, ${bodyColor[1]}, ${bodyColor[2]})`,
          '--accentColor': `rgb(${accentColor[0]}, ${accentColor[1]}, ${accentColor[2]})`,
          }}>
          <DynamicBackground
            fgColor={fgColor}
            bgColor={bgColor}
            accentColor={accentColor}
            pixelDensity={pixelDensity}
            />
          {children}
          <DynamicOverlay
            fgColor={fgColor}
            bgColor={bgColor}
            accentColor={accentColor}
            pixelDensity={pixelDensity}
            />
        </body>
      </GlobalContextContainer>
    </html>
  );
}