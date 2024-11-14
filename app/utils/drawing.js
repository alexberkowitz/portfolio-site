import * as Constants from '@/Constants';
/*-------------------------------------------------------*/
/* Utilities
/*-------------------------------------------------------*/

// Round a number to the nearest multiple of the pixel density
export const roundToPixel = (value) => {
  return Math.round(value / Constants.pixelDensity) * Constants.pixelDensity;
}

// Convert a screen-space coordinate to render pixels
export const pixelCoord = (value, globalSizeModifier) => { // globalSizeModifier is usually the canvas width or height
  return roundToPixel(value - (globalSizeModifier / Constants.pixelDensity));
}

// Convert a render pixel dimension to screen-space
export const pixelDim = (value) => {
  return value * Constants.pixelDensity;
}

// Update the value of a transition control variable.
// Linearly animates between 0 and 1, going forwards while axctive === true
// and backwards while active === false
export const updateTransition = (amount, duration, active) => {
  const step = 1 / duration / Constants.frameRate;

  if( active ) {
    return Math.min(amount + step, 1);
  } else {
    return Math.max(amount - step, 0);
  }
}



/*-------------------------------------------------------*/
/* PIXEL TRANSFORMATIONS
/*-------------------------------------------------------*/

// Dither
//
// Based on Bayer Dithering by illus0r
// https://editor.p5js.org/illus0r/sketches/YkkcqhLmY
export const dither = (context, fgColor, bgColor, autoUpdate) => {
  const normalizedWidth = Math.floor(context.width / Constants.pixelDensity);
  const m = [
    [3, 1],
    [0, 2],
  ];

  context.loadPixels();

  for (let i = 0; i < context.pixels.length; i += 4) {
    let x = (i / 4 | 0) % normalizedWidth;
    let y = (i / 4 / normalizedWidth | 0);
    let thresh = m[x%2][y%2] * 51 + 51; // 255 divided into 5 steps
    let pixel = (context.pixels[i] + context.pixels[i + 1] + context.pixels[i + 2]) / 3; // Pixel brightness as an average of the R,G,B values

    if( context.pixels[i + 3] === 0 ){ // Support transparency
      context.pixels[i] = 0; // Red
      context.pixels[i + 1] = 0; // Green
      context.pixels[i + 2] = 0; // Blue
      context.pixels[i + 3] = 0; // Alpha

    } else {
      context.pixels[i] = pixel < thresh ? fgColor[0] : bgColor[0]; // Red
      context.pixels[i + 1] = pixel < thresh ? fgColor[1] : bgColor[1]; // Green
      context.pixels[i + 2] = pixel < thresh ? fgColor[2] : bgColor[2]; // Blue
      context.pixels[i + 3] = pixel < thresh ? fgColor[3] : bgColor[3]; // Alpha
    }
  }

  if( autoUpdate !== undefined && autoUpdate ){
    context.updatePixels();
  }
}


// Flatten alpha transparencty values to white
export const flattenTransparency = (context) => {
  context.loadPixels();

  for (let i = 0; i < context.pixels.length; i += 4) {
    if( context.pixels[i + 3] > 51 ){ // Below this threshold the pixels will be transparent
      const brightnessVal = (1 - (context.pixels[i + 3] / 255));
      const colorVal = 1 - (1 - context.map(context.pixels[i], 0, 255, 0, 1)) * (1 - brightnessVal);
      context.pixels[i] = colorVal * 255;
      context.pixels[i + 1] = colorVal * 255;
      context.pixels[i + 2] = colorVal * 255;
      context.pixels[i + 3] = 255;
    } else {
      context.pixels[i + 3] = 0;
    }
  }

  context.updatePixels();
}



/*-------------------------------------------------------*/
/* EASING FUNCTIONS
/*-------------------------------------------------------*/
/* Based on Easing Functions Animated by rjgilmour
/* https://editor.p5js.org/rjgilmour/sketches/eqP7q0Y4B
/*-------------------------------------------------------*/

export const ease = (input, timingFunction, strength, reverse) => {
  // Input and output are between 0 and 1

  const easings = {
    sine: easeInOutSine,
    easeIn: easeIn,
    easeOut: easeOut,
    backForthSettle2: easeBackForthSettle2,
    inOutSineScaled: easeInOutSineScaled,
    outSlowBackFast: easeOutSlowBackFast,
    backAndForth: easeBackAndForth,
    outElastic: easeOutElastic,
    backAndForthSettle: easeBackAndForthSettle,
    inOutCubic: easeInOutCubic,
    new: easeNew,
    new2: easeNew2,
    new3: easeNew3
  }

  if ( reverse ){
    input = 1 - input;
  }

  let output = 0;

  if (typeof easings[timingFunction] === 'function') {
    output = easings[timingFunction](input, strength);
  } else {
    console.error('Invalid timing function provided!');
  }

  return reverse ? 1 - output : output;
}

function easeIn(t, strength = 3) {
  return Math.pow(t, strength);
}

function easeOut(t, strength = 3) {
  return 1 - Math.pow(1 - t, strength);
}

function easeInOutSine(x){
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

function easeBackForthSettle2(x){
  // return -(Math.sin(Math.PI * x) ) / 2 **0.5;
  let sd = 0.6;
  let mean = 0.55;
  let backforth = -(Math.sin(Math.PI * x * 2)) / 2 * 4 * Math.exp(-0.5 * ((x-mean)/sd)**2) / (sd*Math.sqrt(2*Math.PI)) * Math.sin(Math.PI*x)**4 / 2;
  return ((Math.cos(Math.PI * x * 2) - 1) / 2 + x) * backforth * 5.7;
}

function easeInOutSineScaled(x){
  return -(Math.cos(Math.PI * x * 2) - 1) / 2;
}

function easeOutSlowBackFast(x) {
  let sd = 0.14;
  let mean = 0.6;
  return -(Math.cos(Math.PI * x * 2) - 1) / 4 +  Math.exp(-0.5 * ((x-mean)/sd)**2) / (sd*Math.sqrt(2*Math.PI)) / 5
}

function easeBackAndForth(x){
  let sd = 0.19;
  let mean = 0.55;
  return -(Math.sin(Math.PI * x * 2)) / 2 * 4 * Math.exp(-0.5 * ((x-mean)/sd)**2) / (sd*Math.sqrt(2*Math.PI)) * Math.sin(Math.PI*x)**4 / 2;
  // return Math.sin(Math.PI*x)
}

function easeOutElastic(x){
  const c4 = (2 * Math.PI) / 3;
  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

function easeBackAndForthSettle(x){
  let sd = 0.19;
  let mean = 0.5;
  return -(Math.sin(Math.PI * x * 2)) / 2 * 4 
    * Math.exp(-0.5 * ((x-mean)/sd)**2) / (sd*Math.sqrt(2*Math.PI)) / 3 
    - Math.exp(-0.5 * ((x-0.9)/0.04)**2) / (0.04*Math.sqrt(2*Math.PI)) / 120;
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeNew(x) { 
  
  x += 0.15
  // return 1 / (1 + Math.exp(-(x-0.5)*15))  // Sigmoid
  
  // let sig = 1 / (1 + Math.exp(-(x-0.5)*15))
  
  // let sinUp = Math.sin(Math.PI*x*2.5)  // ends on 1 rather than 0
  
  let sd = 0.12;
  let mean = 0.5;
  // let bell = -Math.exp(-0.5 * ((x-mean)/sd)**2) / (sd*Math.sqrt(2*Math.PI)) / 3 
  
  sd = 0.12;
  mean = 0.5;
  let offsetBell = -Math.exp(-0.5 * ((x-mean)/sd)**2) / (sd*Math.sqrt(2*Math.PI)) / 3 
  
  let amp =  1
  
  sd = 0.05;
  mean = 0.22;
  let offsetBell2 = -Math.exp(-0.5 * ((x-mean)/sd)**2) / (sd*Math.sqrt(2*Math.PI)) / (200*amp)
  
  sd = 0.15;
  mean = 0.5;
  let offsetBell3 = -Math.exp(-0.5 * ((x-mean)/sd)**2) / (sd*Math.sqrt(2*Math.PI)) / (4.14*amp)
  
  // return Math.sin(Math.PI*x*4) * offsetBell 
  // return offsetBell3 +1
  // return (Math.sin(Math.PI*x*4)/amp * offsetBell - offsetBell2)
  
  sd = 0.05;
  mean = 0.2;
  let offsetBell4 = -Math.exp(-0.5 * ((x-mean)/sd)**2) / (sd*Math.sqrt(2*Math.PI)) / (8.7*amp)
  
  // return offsetBell4 +1
//   
  
  return 2.75 * ( (Math.sin(Math.PI*x*4)/amp * offsetBell - offsetBell2) * (offsetBell3+1) * (offsetBell4 +1))

}

function easeNew2(x) {
  return (-Math.cos(Math.PI*x*6)/2 + 0.5)
}

function easeNew3(x) {
  // let sig = 1 / (1 + Math.exp(-(x-0.5)*15))
  
  let sd = 0.15;
  let mean = 0.5;
  let bell = -Math.exp(-0.5 * ((x-mean)/sd)**2) / (sd*Math.sqrt(2*Math.PI)) / 3 
  
  sd = 0.1;
  mean = 0.333;
  // let offsetBell1 = -Math.exp(-0.5 * ((x-mean)/sd)**2) / (sd*Math.sqrt(2*Math.PI)) / 10
  
  sd = 0.1;
  mean = 0.67;
  let offsetBell = -Math.exp(-0.5 * ((x-mean)/sd)**2) / (sd*Math.sqrt(2*Math.PI)) / 10
  
  // return offsetBell1
  // return -bell
  // return -(Math.cos(Math.PI * x) - 1) / 2 - offsetBell/1.5 - bell/5;
  return -(Math.cos(Math.PI * x) - 1) / 2 - offsetBell/2 - bell/10;
}