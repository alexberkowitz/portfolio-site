// Apply the dither effect
// Based on Bayer Dithering by illus0r
// https://editor.p5js.org/illus0r/sketches/YkkcqhLmY
export const dither = (context, fgColor, bgColor, threshold, pixelDensity, autoUpdate) => {
  const normalizedWidth = Math.floor(context.width / pixelDensity);
  const m = [
    [3, 1],
    [0, 2],
  ];

  context.loadPixels();

  for (let i = 0; i < context.pixels.length; i += 4) {
    let x = (i / 4 | 0) % normalizedWidth;
    let y = (i / 4 / normalizedWidth | 0);
    let thresh = m[x%2][y%2] * 20 + threshold;
    let pixel = (context.pixels[i] + context.pixels[i + 1] + context.pixels[i + 2]) / 3; // Pixel brightness as an average of the R,G,B values

    context.pixels[i] = pixel < thresh ? fgColor[0] : bgColor[0]; // Red
    context.pixels[i + 1] = pixel < thresh ? fgColor[1] : bgColor[1]; // Green
    context.pixels[i + 2] = pixel < thresh ? fgColor[2] : bgColor[2]; // Blue
    context.pixels[i + 3] = pixel < thresh ? fgColor[3] : bgColor[3]; // Alpha
  }

  if( autoUpdate !== undefined && autoUpdate ){
    context.updatePixels();
  }
}