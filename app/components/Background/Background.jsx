/*-------------------------------------------------------*/
/* BACKGROUND
/*-------------------------------------------------------*/
/* Fancy page background with mouse/touch effects
/* powered by p5.js
/*-------------------------------------------------------*/

'use client'

import { useEffect, useState, useRef } from "react";
import p5 from 'p5';
import {
  roundToPixel,
  dither,
  ease
 } from '@/utils/drawing';
import * as Constants from '@/Constants';

import styles from "./background.module.scss";

const Background = () => {
  const renderRef = useRef();
  const [initialized, setInitialized] = useState(false);
  let removeFunction; // Storage for the p.remove() function so we can call it from useEffect

  // Interaction
  const hasTouch = useRef(false);

  // Canvas sizing
  let canvasSize = useRef({w: roundToPixel(window.innerWidth, 'floor'), h: roundToPixel(window.innerHeight, 'floor'),});
  let resizeHandler;
  
  // Cursor trail setup
  let cursorBuffer;
  let cursorPoints = useRef([]); // Cursor trail points
  const cursorLineWidth = useRef(200); // In px
  const cursorDraw = useRef(false); // Whether or not to draw cursor trail
  
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
        hasTouch.current = true;
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
        document.addEventListener("mousemove", () => {
          cursorDraw.current = true;
        });
      }
    }

    // Clean up before unmounting
    return () => {
      removeFunction();
      window.removeEventListener("resize", resizeHandler);
    }
  }, []);


  
  /*-------------------------------------------------------*/
  /* SETUP
  /*-------------------------------------------------------*/
  const drawP5 = () => {

    new p5(p => {
      p.setup = () => {
        p.createCanvas(
          canvasSize.current.w,
          canvasSize.current.h,
          p.WEBGL
        ).parent(renderRef.current);
        p.pixelDensity(1 / Constants.pixelDensity);

        // Graphics buffers
        cursorBuffer = p.createGraphics(p.width, p.height, p.P2D);
        explosionBuffer = p.createGraphics(p.width, p.height, p.P2D);

        // When the window resizes, update the drawing parameters
        resizeHandler = () => {
          const calculatedWidth = roundToPixel(window.innerWidth, 'floor');
          const calculatedHeight = roundToPixel(window.innerHeight, 'floor');
          canvasSize.current = {w: calculatedWidth, h: calculatedHeight};

          p.resizeCanvas(calculatedWidth, calculatedHeight);
          cursorBuffer.resizeCanvas(calculatedWidth, calculatedHeight);
          explosionBuffer.resizeCanvas(calculatedWidth, calculatedHeight);
          setCursorTrailLineWidth();
        }
        window.addEventListener("resize", resizeHandler);

        // Make explosions when the user clicks
        p.mouseClicked = () => {
          explosions.current.push({
            x: p.mouseX,
            y: p.mouseY,
            age: 0
          });
        }

        removeFunction = p.remove; // Store the remove() function
      }

      p.draw = () => {
        p.frameRate(Constants.frameRate);
        p.translate(p.width / -2, p.height / -2, 0);

        // Draw the background
        p.background(255);

        // Draw the cursor trail
        drawCursorTrail(cursorBuffer, p);
        p.image(cursorBuffer, 0, 0);
        
        // Draw click explosions
        drawExplosions(explosionBuffer);
        p.image(explosionBuffer, 0, 0);

        // Apply dither effect
        dither(p, Constants.fgColor, [0,0,0,0], true);
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

    if( cursorPoints.current.length > 0 ){
      context.strokeWeight(cursorLineWidth.current);
      context.strokeCap(context.ROUND);

      // Loop through the points array and draw a curve connecting them
      let points = [...cursorPoints.current];
      points.forEach((point, i) => {
        if( points[i].age < cursorPointMaxAge ){
          // Draw a curve connecting each point to the previous three
          // (curve vertices require four coordinates: two points and two handles)
          if( i >= 4 ){

            // Initial fade-in animation on page load
            const fadeIn = cursorPointMaxAge * 3; // In frames
            const delay = 10; // In frames
            if( !hasTouch.current && p.frameCount - delay < fadeIn ){
              const strokeWeight = ease(Math.max(0, p.frameCount - delay) / fadeIn, 'new3') * cursorLineWidth.current;
              context.strokeWeight(strokeWeight);
            }

            // Draw the lines
            let value = 255 * (point.age / cursorPointMaxAge);
            context.stroke(value, value, value);
            context.beginShape();
            context.curveVertex(
              points[i-3].x,
              points[i-3].y
            );
            context.curveVertex(
              points[i-2].x,
              points[i-2].y
            );
            context.curveVertex(
              points[i-1].x,
              points[i-1].y
            );
            context.curveVertex(
              point.x,
              point.y
            );
            context.endShape();
          }

          point.age += 1;

        } else {
          points.splice(i, 1); // Delete the point when it gets too old
        }
      });
      cursorPoints.current = [...points];

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

      let explosionList = [...explosions.current];
      explosionList.forEach((explosion, i) => {
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
 
          explosion.age += 1;

        } else {
          explosionList.splice(i, 1);
        }
      });
      explosions.current = [...explosionList]; // Delete the explosion when it gets too old

      // Apply blur
      context.filter(context.BLUR, explosionStartSize / 4);
    }
  }
  


  /*-------------------------------------------------------*/
  /* RENDER
  /*-------------------------------------------------------*/
  return (
    <div className={styles.background} ref={renderRef}></div>
  );
}

export default Background;