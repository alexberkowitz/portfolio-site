// Apply the dither effect
// Based on Bayer Dithering by illus0r
// https://editor.p5js.org/illus0r/sketches/YkkcqhLmY
export const dither = (p, fgColor, bgColor, pixelDensity, autoUpdate) => {
  const normalizedWidth = Math.floor(p.width / pixelDensity);
  const m = [
    [3, 1],
    [0, 2],
  ];

  p.loadPixels();

  for (let i = 0; i < p.pixels.length; i += 4) {
    let x = (i / 4 | 0) % normalizedWidth;
    let y = (i / 4 / normalizedWidth | 0);
    let thresh = m[x%2][y%2] * 20 + 60;
    let pixel = (p.pixels[i] + p.pixels[i + 1] + p.pixels[i + 2]) / 3; // Pixel brightness as an average of the R,G,B values

    p.pixels[i] = pixel < thresh ? fgColor[0] : bgColor[0]; // Red
    p.pixels[i + 1] = pixel < thresh ? fgColor[1] : bgColor[1]; // Green
    p.pixels[i + 2] = pixel < thresh ? fgColor[2] : bgColor[2]; // Blue
    p.pixels[i + 3] = 255; // Alpha
  }

  if( autoUpdate !== undefined && autoUpdate ){
    p.updatePixels();
  }
}