'use client'

import { useEffect, useState, useRef } from "react";
import Dither from 'canvas-dither';
// import 'context-filter-polyfill';
import styles from "./background.module.scss";

const Background = (props) => {
  const canvasRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  let points = useRef([]); // Place to put the circles
  const lineWidth = useRef(100); // In px
  const drawing = useRef(false); // Whether or not to draw circles
  const mousePos = useRef({x: 0, y: 0}); // Mouse coordinates
  
  const circleMaxAge = 10; // In frames
  const resoltionDivision = 2; // Size of each dither pixel
  let ctx; // Canvas context
  
  // Initial setup
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);
      ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
      canvasRef.current.width = window.innerWidth / resoltionDivision;
      canvasRef.current.height = window.innerHeight / resoltionDivision;
      lineWidth.current = Math.min(Math.max(window.innerWidth / 10, 30), 100);

      // Users with a mouse will see a cursor trail.
      // Users with a touchscreen will see a touch effect.
      if( window.matchMedia('(pointer: fine)').matches ){
        window.addEventListener("mousemove", (e) => updateMousePos(e, 'mouse'));
        drawing.current = true;
      } else {
        document.addEventListener("touchstart", (e) => {updateMousePos(e, 'touch'); drawing.current = true;});
        document.addEventListener("touchend", () => drawing.current = false);
        window.addEventListener("touchmove", (e) => updateMousePos(e, 'touch'));
      }

      window.addEventListener("resize", updateCanvasSize);
      draw();
    }
  }, [initialized]);
  
  // Draw the circles and animate on canvas
  const draw = () => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear the canvas.

    // Before the canvas loads there is no context
    if( !ctx || ctx == null ) {
      return false;
    }

    // We add a new circle every frame while drawing
    if( drawing.current ){
      points.current.push({
        x: mousePos.current.x,
        y: mousePos.current.y,
        radius: lineWidth.current/resoltionDivision,
        age: 0
      });
    }

    // Give the canvas a background
    ctx.beginPath();
    ctx.rect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = "#eeeeee"; // Slightly off-white makes the dithering appear everywhere
    ctx.fill();

    // A "seed" shape ensures there is always a dithering effect even when we aren't drawing
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.rect(0, 0, 1, 1);
    ctx.fill();
    
    // When we draw the circles, we want it to be blurry
    ctx.filter = `blur(${lineWidth.current/resoltionDivision/4}px)`;

    // Loop through the points array and draw each one
    let prevPoint = {};
    points.current.forEach((point, i) => {
      if( point.age <= circleMaxAge ){
        // Draw a line connecting each point to the previous one
        if( i > 0 ){
          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.lineTo(point.x, point.y);
          ctx.strokeStyle = `rgba(35, 35, 35, ${1 - (point.age / circleMaxAge)})`;
          ctx.lineWidth = lineWidth.current;
          ctx.lineCap = "round";
          ctx.stroke();
        }
        prevPoint = point;

      } else {
        delete points.current[i]; // Delete the circle when it gets too old
      }

      point.age += 1;
    });

    // Reset the filter to perform the dithering operation
    ctx.filter = 'none';

    // // Retrieve the image data of the canvas
    let image = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

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
    ctx.putImageData(image, 0, 0);

    // Call the next animation frame
    requestAnimationFrame(draw);
  }
  
  // Keep track of the mouse position
  const updateMousePos = (e, eventType) => {
    if( eventType === 'mouse' ){
      mousePos.current = {
        x: e.clientX / resoltionDivision,
        y: e.clientY / resoltionDivision
      };
    } else {
      mousePos.current = {
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