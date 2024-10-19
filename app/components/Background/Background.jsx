'use client'

import { useEffect, useState, useRef } from "react";
import p5 from 'p5';
import styles from "./background.module.scss";

const Background = (props) => {
  const renderRef = useRef();
  const [initialized, setInitialized] = useState(false);
  let points = useRef([]); // Place to put the circles
  const drawing = useRef(true); // Whether or not to draw circles
  const lineWidth = useRef(300); // In px
  const pointMaxAge = 10; // In frames
  const pixelDensity = 2; // Number of screen pixels each canvas pixel occupies
  
  // Initial setup
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);
      
      setLineWidth();
      drawP5(); // Start the drawing

      // // Users with a mouse will see a cursor trail.
      // // Users with a touchscreen will see a touch effect.
      if( !window.matchMedia('(pointer: fine)').matches ){
        drawing.current = false;
        document.addEventListener("touchstart", (e) => {drawing.current = true;});
        document.addEventListener("touchend", () => drawing.current = false);
      }
    }
  }, [initialized]);

  const setLineWidth = () => {
    lineWidth.current = Math.min(Math.max(window.innerWidth / 4, 100), 300);
  }

  const drawP5 = () => {
    new p5(p => {
      p.setup = () => {
        p.createCanvas(Math.floor(window.innerWidth), Math.floor(window.innerHeight)).parent(renderRef.current);
        p.pixelDensity(1 / pixelDensity);

        // When the window resizes, update the drawing parameters
        window.addEventListener("resize", () => {
          p.resizeCanvas(Math.floor(window.innerWidth), Math.floor(window.innerHeight));
          setLineWidth();
        });
    }

      p.draw = () => {
        p.frameRate(30);
        p.background(255,255,255);
        
        if( drawing.current ){
          points.current.push({
            x: p.mouseX,
            y: p.mouseY,
            age: 0
          });
        }

        p.strokeWeight(lineWidth.current);

        // Loop through the points array and draw each one
        let prevPoint = {};
        points.current.forEach((point, i) => {
          if( point.age <= pointMaxAge ){
            // Draw a line connecting each point to the previous one
            if( i > 0 ){
              const value = 255 * (point.age / pointMaxAge);
              p.stroke(value, value, value);
              p.line(prevPoint.x, prevPoint.y, point.x, point.y);
            }
            prevPoint = point;

          } else {
            delete points.current[i]; // Delete the circle when it gets too old
          }

          point.age += 1;
        });
        p.filter(p.BLUR, lineWidth.current / 4);

        const normalizedWidth = Math.floor(p.width / pixelDensity);

        // Apply dither effect
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
      
          p.pixels[i] = pixel < thresh ? props.fgColor[0] : props.bgColor[0]; // Red
          p.pixels[i + 1] = pixel < thresh ? props.fgColor[1] : props.bgColor[1]; // Green
          p.pixels[i + 2] = pixel < thresh ? props.fgColor[2] : props.bgColor[2]; // Blue
          p.pixels[i + 3] = 255; // Alpha
        }

        // Apply grid
        const gridSpace = 4;
        const rowLength = normalizedWidth * 4; // There are four entries for each pixel
        for( let y = 0; y < p.pixels.length; y += rowLength * gridSpace ){
          for (let x = y; x < y + rowLength; x+= 4 * gridSpace) {
            p.pixels[x] = props.fgColor[0] // red;
            p.pixels[x+1] = props.fgColor[1]; // green
            p.pixels[x+2] = props.fgColor[2]; // blue;
            p.pixels[x+3] = 255; // alpha
          }
        }
        
        p.updatePixels();
      }
    });
  }
  
  return (
    <div className={styles.background} ref={renderRef}></div>
  );
}

export default Background;