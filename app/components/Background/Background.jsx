'use client'

import { useEffect, useState, useRef } from "react";
import p5 from 'p5';
import { useGlobalContext } from '@/GlobalContext';
import { dither, ease } from '@/utils/drawing';
import * as Constants from '@/Constants';

import styles from "./background.module.scss";

const Background = () => {
  const globalContext = useGlobalContext();
  const renderRef = useRef();
  const [initialized, setInitialized] = useState(false);

  // Grid setup
  let gridBuffer;
  
  // Cursor trail setup
  let cursorBuffer;
  let cursorPoints = useRef([]); // Cursor trail points
  const cursorLineWidth = useRef(200); // In px
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
      } else {
        // Only show the cursor trail when it is over the document
        // to avoid the image being "left behind"
        document.addEventListener("mouseleave", () => {
          cursorDraw.current = false;
        });
        document.addEventListener("mouseenter", () => {
          cursorDraw.current = true;
        });
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
          Math.round(Math.floor(window.innerHeight) / Constants.pixelDensity) * Constants.pixelDensity,
          p.WEBGL
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
        globalContext.setCursorPos({x: p.mouseX, y: p.mouseY}); // Store the cursor pos for other components to use
        p.translate(p.width / -2, p.height / -2, 0);

        // Draw the background
        p.background(255);

        // Draw the cursor trail
        if( globalContext.cursorTrail.current ){
          drawCursorTrail(cursorBuffer, p);
          p.image(cursorBuffer, 0, 0);
        }
        
        // Draw click explosions
        drawExplosions(explosionBuffer);
        p.image(explosionBuffer, 0, 0);

        // Apply dither effect
        dither(p, Constants.fgColor, Constants.bgColor, true);

        // Apply dot grid
        drawDotGrid(gridBuffer);
        p.image(gridBuffer, 0, 0);
      }
    });
  }


  /*-------------------------------------------------------*/
  /* CURSOR TRAIL
  /*-------------------------------------------------------*/

  // Update cursor trail line width
  const setCursorTrailLineWidth = () => {
    cursorLineWidth.current = Math.min(Math.max(window.innerWidth / 4, 80), 150);
  }
  
  // Draw a fading trail following the cursor
  const drawCursorTrail = (context, p) => {
    context.clear();
    context.noFill();

    const cursorPointMaxAge = 10; // In frames

    // Add the current cursor position to the points list
    if( cursorDraw.current ){
      cursorPoints.current.push({
        x: p.mouseX,
        y: p.mouseY,
        age: 0
      });
    }

    if( cursorPoints.current.length >= 4 ){
      context.strokeWeight(cursorLineWidth.current);
      context.strokeCap(context.ROUND);

      // Loop through the points array and draw a curve connecting them
      cursorPoints.current.forEach((point, i) => {
        if( point.age <= cursorPointMaxAge ){
          // Draw a curve connecting each point to the previous three
          // (curve vertices require four coordinates: two points and two handles)
          if( i >= 4 ){
            const fadeIn = cursorPointMaxAge * 3; // In frames
            const delay = 10; // In frames
            if( p.frameCount - delay < fadeIn ){
              const strokeWeight = ease(Math.max(0, p.frameCount - delay) / fadeIn, 'new3') * cursorLineWidth.current;
              context.strokeWeight(strokeWeight);
            }
            const value = 255 * (point.age / cursorPointMaxAge);
            context.stroke(value, value, value);
            context.beginShape();
            context.curveVertex(
              cursorPoints.current[i-3].x,
              cursorPoints.current[i-3].y
            );
            context.curveVertex(
              cursorPoints.current[i-2].x,
              cursorPoints.current[i-2].y
            );
            context.curveVertex(
              cursorPoints.current[i-1].x,
              cursorPoints.current[i-1].y
            );
            context.curveVertex(
              point.x,
              point.y
            );
            context.endShape();
          }

        } else {
          delete cursorPoints.current[i-3]; // Delete the circle when it gets too old
        }

        point.age += 1;
      });
      // context.endShape();

      // Apply blur
      context.filter(context.BLUR, cursorLineWidth.current / 5);
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
      context.clear(255);
      context.noFill();
      context.stroke(0, 0, 0, 255);

      explosions.current.forEach((explosion, i) => {
        if( explosion.age <= explosionDuration ){
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