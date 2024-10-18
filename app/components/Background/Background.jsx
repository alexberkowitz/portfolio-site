'use client'

import { useEffect, useState, useRef } from "react";
let Dither = require('canvas-dither');

const Background = (props) => {
  const canvasRef = useRef(null);
  const [initialized, setInitialized] = useState(false);

  let circles = []; // Place to put the circles
  let mousePos = {x: 0, y: 0}; // Mouse coordinates
  const circleMaxAge = 10; // In frames
  const resoltionDivision = 2; // Size of each dither pixel
  const circleStartingRadius = 100 / resoltionDivision; // In px
  
  // Start drawing once
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);
      canvasRef.current.width = window.innerWidth / resoltionDivision;
      canvasRef.current.height = window.innerHeight / resoltionDivision;
      window.addEventListener("mousemove", updateMousePos);
      window.addEventListener("resize", updateCanvasSize);
      draw();
    }
  }, [initialized]);
  
  // Draw the circles and animate on canvas
  const draw = () => {
    const context = canvasRef.current.getContext('2d', { willReadFrequently: true });

    context.globalCompositeOperation = "source-over"; // Default blending mode
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear the canvas.

    // Before the canvas loads there is no context
    if( !context || context == null ) {
      return false;
    }

    // We add a new circle every frame
    circles.push({
      x: mousePos.x,
      y: mousePos.y,
      radius: circleStartingRadius,
      color: '#000000',
      age: 0
    });

    // Give the canvas a background
    context.beginPath();
    context.rect(0, 0, canvasRef.current.width, canvasRef.current.height);
    context.fillStyle = "#dddddd"; // Slightly off-white makes the dithering appear everywhere
    context.fill();
    
    // When we draw the circles, we want it to be blurry
    context.filter = `blur(${circleStartingRadius}px)`;

    // Loop through the circles array and draw each one
    circles.forEach((circle, i) => {
      if( circle.age <= circleMaxAge ){
        context.beginPath();
        context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        context.fillStyle = circle.color;
        context.globalAlpha = 1 - (circle.age / circleMaxAge); // Fade out over time
        context.fill();

      } else {
        delete circles[i]; // Delete the circle when it gets too old
      }

      circle.age += 1;
    });

    // Reset the filter to perform the dithering operation
    context.filter = 'none';

    // // Retrieve the image data of the canvas
    let image = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

    // // Dither the data using the Atkinson algoritm
    Dither.atkinson(image);

    // Remap the colors
    const data = image.data;
    for (let i = 0; i < data.length; i += 4) {
      if( data[i] === 255 ) { // White parts of the image become the background
        data[i] = props.bgColor[0];     // R
        data[i + 1] = props.bgColor[1]; // G
        data[i + 2] = props.bgColor[2]; // B
      } else { // Black parts of the image become the foregound
        data[i] = props.fgColor[0];     // R
        data[i + 1] = props.fgColor[1]; // G
        data[i + 2] = props.fgColor[2]; // B
      }
    }

    // Place the image data back on the canvas
    context.putImageData(image, 0, 0);

    // Call the next animation frame
    requestAnimationFrame(draw);
  }
  
  // Keep track of the mouse position
  const updateMousePos = (event) => {
    mousePos = {
      x: event.clientX / resoltionDivision,
      y: event.clientY / resoltionDivision
    };
  }

  // Update the canvas dimensions
  const updateCanvasSize = () => {
    canvasRef.current.width = window.innerWidth / resoltionDivision;
    canvasRef.current.height = window.innerHeight / resoltionDivision;
  }
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100dvw',
        height: '100dvh',
        imageRendering: 'pixelated',
        clipPath: `polygon(var(--pagePadding) var(--pagePadding), calc(100% - var(--pagePadding)) var(--pagePadding), calc(100% - var(--pagePadding)) calc(100% - var(--pagePadding)), var(--pagePadding) calc(100% - var(--pagePadding)))`,
        zIndex: -1
      }}
    ></canvas>
  );
}

export default Background;