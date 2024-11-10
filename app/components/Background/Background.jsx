'use client'

import { useEffect, useState, useRef } from "react";
import p5 from 'p5';
import { dither, ease } from '@/utils/drawing';
import * as Constants from '@/Constants';

import styles from "./background.module.scss";

const Background = () => {
  const renderRef = useRef();
  const [initialized, setInitialized] = useState(false);

  // Grid setup
  let gridBuffer;
  
  // Cursor trail setup
  let cursorBuffer;
  let cursorPoints = useRef([]); // Cursor trail points
  const cursorLineWidth = useRef(300); // In px
  const cursorDraw = useRef(true); // Whether or not to draw cursor trail
  
  // Explosions setup
  let explosionBuffer;
  let explosions = useRef([]); // Click effect explosions
  
  // Initial setup
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);
      
      setCursorTrailLineWidth();
      drawP5(); // Start the drawing

      // Users with a mouse will see a cursor trail.
      // Users with a touchscreen will see a touch effect.
      if( !window.matchMedia('(pointer: fine)').matches ){
        cursorDraw.current = false;
        document.addEventListener("touchstart", () => cursorDraw.current = true);
        document.addEventListener("touchend", () => cursorDraw.current = false);
      }
    }
  }, []);


  
  /*-------------------------------------------------------*/
  /* SETUP
  /*-------------------------------------------------------*/
  const drawP5 = () => {

    new p5(p => {
      p.setup = () => {
        p.createCanvas(
          Math.round(Math.floor(window.innerWidth) / Constants.pixelDensity) * Constants.pixelDensity,
          Math.round(Math.floor(window.innerHeight) / Constants.pixelDensity) * Constants.pixelDensity
        ).parent(renderRef.current);
        p.pixelDensity(1 / Constants.pixelDensity);

        // Graphics buffers
        gridBuffer = p.createGraphics(p.width, p.height, p.P2D);
        cursorBuffer = p.createGraphics(p.width, p.height, p.P2D);
        explosionBuffer = p.createGraphics(p.width, p.height, p.P2D);

        // When the window resizes, update the drawing parameters
        window.addEventListener("resize", () => {
          const calculatedWidth = Math.round(Math.floor(window.innerWidth) / Constants.pixelDensity) * Constants.pixelDensity;
          const calculatedHeight = Math.round(Math.floor(window.innerHeight) / Constants.pixelDensity) * Constants.pixelDensity;
          p.resizeCanvas(calculatedWidth, calculatedHeight);
          gridBuffer.resizeCanvas(calculatedWidth, calculatedHeight);
          cursorBuffer.resizeCanvas(calculatedWidth, calculatedHeight);
          explosionBuffer.resizeCanvas(calculatedWidth, calculatedHeight);
          setCursorTrailLineWidth();
        });

        // Make explosions when the user clicks
        p.mouseClicked = () => {
          explosions.current.push({
            x: p.mouseX,
            y: p.mouseY,
            age: 0
          });
        }
      }

      p.draw = () => {
        p.frameRate(Constants.frameRate);

        // Draw the background
        p.background(Constants.bgColor[0], Constants.bgColor[1], Constants.bgColor[2]);

        // Apply dot grid
        drawDotGrid(gridBuffer);
        p.image(gridBuffer, 0, 0);
        
        // Draw the cursor trail
        drawCursorTrail(cursorBuffer, p);
        p.image(cursorBuffer, 0, 0);
        
        // Draw click explosions
        drawExplosions(explosionBuffer);
        p.image(explosionBuffer, 0, 0);
      }
    });
  }


  /*-------------------------------------------------------*/
  /* CURSOR TRAIL
  /*-------------------------------------------------------*/

  // Update cursor trail line width
  const setCursorTrailLineWidth = () => {
    cursorLineWidth.current = Math.min(Math.max(window.innerWidth / 4, 100), 250);
  }
  
  // Draw a fading trail following the cursor
  const drawCursorTrail = (context, p) => {
    const cursorPointMaxAge = 10; // In frames
    context.noFill();

    // Add the current cursor position to the points list
    if( cursorDraw.current ){
      cursorPoints.current.push({
        x: p.mouseX,
        y: p.mouseY,
        age: 0
      });
    }

    if( cursorPoints.current.length > 0 ){
      context.background(255);
      context.strokeWeight(cursorLineWidth.current);
      context.strokeCap(context.ROUND);

      // Loop through the points array and draw each one
      let prevPoint = {};
      cursorPoints.current.forEach((point, i) => {
        if( point.age <= cursorPointMaxAge ){
          const fadeIn = cursorPointMaxAge * 3; // In frames
          const delay = 10; // In frames

          // Draw a line connecting each point to the previous one
          if( i > 0 ){
            if( p.frameCount - delay < fadeIn ){
              const strokeWeight = ease(Math.max(0, p.frameCount - delay) / fadeIn, 'new3') * cursorLineWidth.current;
              context.strokeWeight(strokeWeight);
            }
            const value = 255 * (point.age / cursorPointMaxAge);
            context.stroke(value, value, value);
            context.line(
              prevPoint.x,
              prevPoint.y,
              point.x, 
              point.y
            );
          }
          prevPoint = point;

        } else {
          delete cursorPoints.current[i]; // Delete the circle when it gets too old
        }

        point.age += 1;
      });

      // Apply blur
      context.filter(context.BLUR, cursorLineWidth.current / 4);

      // Apply dither effect
      const bgColor = [0, 0, 0, 0]; // Transparent
      dither(context, Constants.fgColor, bgColor, 60, true);
    }
  }



  /*-------------------------------------------------------*/
  /* CLICK EXPLOSIONS
  /*-------------------------------------------------------*/
  const drawExplosions = (context) => {
    const explosionDuration = 10; // In frames
    const explosionStartSize = 100; // In px
    const explosionEndSize = 400; // In px

    if( explosions.current.length > 0 ){ // Don't try to draw explosions if there aren't any
      context.background(255);
      context.noFill();
      context.stroke(0, 0, 0, 255);

      explosions.current.forEach((explosion, i) => {
        if( explosion.age <= explosionDuration ){
          // const explosionSize = context.map(explosion.age, 0, explosionDuration, explosionStartSize, explosionEndSize);
          const explosionSize = context.lerp(
            explosionStartSize,
            explosionEndSize,
            ease(explosion.age / explosionDuration, 'easeOut', 4)
          )

          context.strokeWeight((1 - (explosion.age / explosionDuration)) * explosionStartSize);
          context.circle(
            explosion.x,
            explosion.y,
            explosionSize
          );
          
        } else {
          delete explosions.current[i];
        }

        explosion.age += 1;
      });

      // Apply blur
      context.filter(context.BLUR, explosionStartSize / 4);

      // Apply dither effect
      const bgColor = [0, 0, 0, 0]; // Transparent
      dither(context, Constants.fgColor, bgColor, 90, true);
    }
  }



  /*-------------------------------------------------------*/
  /* DOT GRID
  /*-------------------------------------------------------*/
  const drawDotGrid = (context) => {
    const normalizedWidth = Math.floor(context.width / Constants.pixelDensity);
    const gridSpace = 8;
    const rowLength = normalizedWidth * 4; // There are four entries for each pixel

    context.loadPixels();

    for( let y = rowLength * gridSpace / 2; y < context.pixels.length; y += rowLength * gridSpace ){
      for (let x = y + (gridSpace * 2); x < y + rowLength; x+= 4 * gridSpace) {
        context.pixels[x] = Constants.fgColor[0] // red;
        context.pixels[x+1] = Constants.fgColor[1]; // green
        context.pixels[x+2] = Constants.fgColor[2]; // blue;
        context.pixels[x+3] = 255; // alpha
      }
    }

    context.updatePixels();
  }
  


  /*-------------------------------------------------------*/
  /* RENDER
  /*-------------------------------------------------------*/
  return (
    <div className={styles.background} ref={renderRef}></div>
  );
}

export default Background;