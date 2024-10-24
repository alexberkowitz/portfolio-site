/*-------------------------------------------------------*/
/* DITHERING
/*-------------------------------------------------------*/
/* Based on Bayer Dithering by illus0r
/* https://editor.p5js.org/illus0r/sketches/YkkcqhLmY
/*-------------------------------------------------------*/
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

/*-------------------------------------------------------*/
/* EASING FUNCTIONS
/*-------------------------------------------------------*/
/* Based on Easing Functions Animated by rjgilmour
/* https://editor.p5js.org/rjgilmour/sketches/eqP7q0Y4B
/*-------------------------------------------------------*/
export const ease = (x, type) => {
  // Input and output are between 0 and 1
  switch( type ){
    case 'backForthSettle2':
      return easeBackForthSettle2(x);
    case 'inOutSineScaled':
      return easeInOutSineScaled(x);
    case 'outSlowBackFast':
      return easeOutSlowBackFast(x);
    case 'backAndForth':
      return easeBackAndForth(x);
    case 'outElastic':
      return easeOutElastic(x);
    case 'linear':
      return easeLinear(x);
    case 'backAndForthSettle':
      return easeBackAndForthSettle(x);
    case 'inOutCubic':
      return easeInOutCubic(x);
    case 'new':
      return easeNew(x);
    case 'new2':
      return easeNew2(x);
    case 'new3':
      return easeNew3(x);
    default:
      return easeInOutSine(x);
  }
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
  const c4 = (2 * Math.Math.PI) / 3;
  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.Math.sin((x * 10 - 0.75) * c4) + 1;
}

function easeLinear(x) {
  return x;
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
  let bell = -Math.exp(-0.5 * ((x-mean)/sd)**2) / (sd*Math.sqrt(2*Math.PI)) / 3 
  
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