import { MuseoModerno, Oxanium } from "next/font/google";

import GlobalContextContainer from './GlobalContext';
import Background from '@/components/Background/Background';
import Cursor from '@/components/Cursor/Cursor';

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

const fgColor = [255, 43, 6];
const bgColor = [219, 216, 206];
const pixelDensity = 2;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GlobalContextContainer>
        <body className={`${museoModerno.variable} ${oxanium.variable}`} style={{
          '--bgColor': `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`,
          '--borderColor': `rgb(${fgColor[0]}, ${fgColor[1]}, ${fgColor[2]})`,
          }}>
          <Background
            fgColor={fgColor}
            bgColor={bgColor}
            pixelDensity={pixelDensity}
            />
          {children}
          <Cursor
            fgColor={fgColor}
            bgColor={bgColor}
            pixelDensity={pixelDensity}
            />
        </body>
      </GlobalContextContainer>
    </html>
  );
}