'use client'

import { useEffect, useState, useRef } from "react";
let Dither = require('canvas-dither');
import styles from "./background.module.scss";

const Background = (props) => {
  const canvasRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  
  let circles = []; // Place to put the circles
  let circleStartingRadius = 100; // In px
  let drawing = false;
  let mousePos = {x: 0, y: 0}; // Mouse coordinates
  const circleMaxAge = 10; // In frames
  const resoltionDivision = 2; // Size of each dither pixel
  
  // Start drawing once
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);
      canvasRef.current.width = window.innerWidth / resoltionDivision;
      canvasRef.current.height = window.innerHeight / resoltionDivision;
      circleStartingRadius = Math.min(Math.max(window.innerWidth / 10, 30), 100);

      // Users with a mouse will see a cursor trail.
      // Users with a touchscreen will see a touch effect.
      if( window.matchMedia('(pointer: fine)').matches ){
        window.addEventListener("mousemove", (e) => updateMousePos(e, 'mouse'));
        drawing = true;
      } else {
        document.addEventListener("touchstart", (e) => {updateMousePos(e, 'touch'); drawing = true;});
        document.addEventListener("touchend", () => drawing = false);
        window.addEventListener("touchmove", (e) => updateMousePos(e, 'touch'));
      }

      window.addEventListener("resize", updateCanvasSize);
      draw();
    }
  }, [initialized]);
  
  // Draw the circles and animate on canvas
  const draw = () => {
    const context = canvasRef.current.getContext('2d', { willReadFrequently: true });

    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear the canvas.

    // Before the canvas loads there is no context
    if( !context || context == null ) {
      return false;
    }

    // We add a new circle every frame while drawing
    if( drawing ){
      circles.push({
        x: mousePos.x,
        y: mousePos.y,
        radius: circleStartingRadius/resoltionDivision,
        age: 0
      });
    }

    // Give the canvas a background
    context.beginPath();
    context.rect(0, 0, canvasRef.current.width, canvasRef.current.height);
    context.fillStyle = "#eeeeee"; // Slightly off-white makes the dithering appear everywhere
    context.fill();

    // A "seed" shape ensures there is always a dithering effect even when we aren't drawing
    context.fillStyle = "#000000";
    context.beginPath();
    context.rect(0, 0, 1, 1);
    context.fill();
    
    // When we draw the circles, we want it to be blurry
    context.filter = `blur(${circleStartingRadius/resoltionDivision}px)`;

    // Loop through the circles array and draw each one
    circles.forEach((circle, i) => {
      if( circle.age <= circleMaxAge ){
        context.beginPath();
        context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(35, 35, 35, ${1 - (circle.age / circleMaxAge)})`;
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
    Dither.bayer(image, 128);

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
  const updateMousePos = (e, eventType) => {
    if( eventType === 'mouse' ){
      mousePos = {
        x: e.clientX / resoltionDivision,
        y: e.clientY / resoltionDivision
      };
    } else {
      mousePos = {
        x: e.touches[0].clientX / resoltionDivision,
        y: e.touches[0].clientY / resoltionDivision
      };
    }
  }

  // Update the canvas dimensions
  const updateCanvasSize = () => {
    canvasRef.current.width = window.innerWidth / resoltionDivision;
    canvasRef.current.height = window.innerHeight / resoltionDivision;
  }
  
  return (
    <canvas
      ref={canvasRef}
      className={styles.background}
    ></canvas>
  );
}

export default Background;