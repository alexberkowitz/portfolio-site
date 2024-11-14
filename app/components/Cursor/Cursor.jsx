'use client'

import { useEffect, useState, useRef } from "react";
import p5 from 'p5';
import {
  roundToPixel,
  pixelDim,
  updateTransition,
  ease
} from '@/utils/drawing';
import * as Constants from '@/Constants';

import styles from "./cursor.module.scss";

const Cursor = () => {
  const renderRef = useRef();
  const [initialized, setInitialized] = useState(false);
  let removeFunction; // Storage for the p.remove() function so we can call it from useEffect
  
  // Cursor
  const [cursorPos, setCursorPos] = useState({x: 0, y: 0});
  const hasCursor = useRef(false);
  const showCursor = useRef(false);
  const transitionAmount = useRef(0); // 0-1 interpolation between prevCursor and cursor values
  const transitionDuration = .3; // Seconds

  // Definitions for the different cursor types
  const cursorTypes = {
    default: {
      name: 'default',
      targetBoxSize: 4,
      targetBoxCorner: 0,
      crosshairWidth: 23, // Value for other types shouldn't exceed this
      crosshairHeight: 23, // Value for other types shouldn't exceed this
      crosshairGap: 2,
      beamWidth: 0
    },
    text: {
      name: 'text',
      targetBoxSize: 0,
      targetBoxCorner: 0,
      crosshairWidth: 0,
      crosshairHeight: 13,
      crosshairGap: 0,
      beamWidth: 3
    },
    interactive: {
      name: 'interactive',
      targetBoxSize: 16,
      targetBoxCorner: 16,
      crosshairWidth: 23,
      crosshairHeight: 23,
      crosshairGap: 2,
      beamWidth: 0
    },
  }

  const prevCursor = useRef({...cursorTypes.default}); // Previous cursor state
  const nextCursor = useRef({...cursorTypes.default}); // Target cursor state

  const cursor = useRef({...cursorTypes.default}); // Current cursor state (updates every frame)



  /*-------------------------------------------------------*/
  /* UTILITY FUNCTIONS
  /*-------------------------------------------------------*/

  // Set the cursor type based on the target element
  const setCursor = (target) => {
    let detectedCursorType = 'default';

    // Check for text containers
    if(
      target.closest('p') !== null ||
      target.closest('h1') !== null ||
      target.closest('h2') !== null ||
      target.closest('h3') !== null ||
      target.closest('h4') !== null ||
      target.closest('h5') !== null ||
      target.closest('h6') !== null ||
      target.closest('li') !== null ||
      target.closest('code') !== null
      ){
      detectedCursorType = 'text';
    }

    // Sometimes images appear inside paragraphs, so we can override that behavior like this
    if( target.closest('img') !== null ){
      detectedCursorType = 'default';
    }

    // Check for interactive elements
    // This takes precedence, so it goes last
    if( target.closest('a') !== null ||
        target.closest('button') !== null ){
      detectedCursorType = 'interactive';
    }

    // Set the cursor type from the definitions object
    if( nextCursor.current.name !== detectedCursorType ){ // The cursor type has changed
      prevCursor.current = {...cursor.current}; // Store the cursor state
      transitionAmount.current = 0; // Reset the transition
    }
    nextCursor.current = cursorTypes[detectedCursorType];
  }

  // Update cursor parameters with animations
  const updateCursorParams = () => {
    const lerp = (a, b, alpha) => { return a + alpha * ( b - a ) };

    cursor.current = {
      name: nextCursor.current.name,
      targetBoxSize: lerp(
        prevCursor.current.targetBoxSize,
        nextCursor.current.targetBoxSize,
        ease(transitionAmount.current, 'sine')
      ),
      targetBoxCorner: lerp(
        prevCursor.current.targetBoxCorner,
        nextCursor.current.targetBoxCorner,
        ease(transitionAmount.current, 'sine')
      ),
      crosshairWidth: lerp(
        prevCursor.current.crosshairWidth,
        nextCursor.current.crosshairWidth,
        ease(transitionAmount.current, 'sine')
      ),
      crosshairHeight: lerp(
        prevCursor.current.crosshairHeight,
        nextCursor.current.crosshairHeight,
        ease(transitionAmount.current, 'sine')
      ),
      crosshairGap: lerp(
        prevCursor.current.crosshairGap,
        nextCursor.current.crosshairGap,
        ease(transitionAmount.current, 'sine')
      ),
      beamWidth: lerp(
        prevCursor.current.beamWidth,
        nextCursor.current.beamWidth,
        ease(transitionAmount.current, 'sine')
      ),
    }
  }
  
  /*-------------------------------------------------------*/
  /* SETUP
  /*-------------------------------------------------------*/

  // Initial setup
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);

      // The cursor only shows if a mouse is available
      if( window.matchMedia('(pointer: fine)').matches ){
        hasCursor.current = true;

        // If the component fails to load, the cursor styles fall back to the default
        const style = document.createElement("style");
        style.textContent = "* { cursor: none !important; }";
        document.head.appendChild(style);
      }

      // Show the cursor if one is in use
      document.addEventListener('mousemove', (e) => {
        showCursor.current = true;

        // Set the cursor position
        setCursorPos({
          x: e.clientX,
          y: e.clientY
        })

        // Set the cursor type
        setCursor(e.target);
      });

      // Hide/show the cursor when it leaves the window so the drawing doesn't get "left behind"
      document.addEventListener('mouseenter', () => { showCursor.current = true; });
      document.addEventListener('mouseleave', () => { showCursor.current = false; });

      drawP5(); // Start the drawing
    }

    // Clean up before unmounting
    return () => {
      removeFunction();
    }
  }, []);

  // Drawing setup
  const drawP5 = () => {
    new p5(p => {
      p.setup = () => {
        p.createCanvas(
          pixelDim(cursorTypes.default.crosshairWidth),
          pixelDim(cursorTypes.default.crosshairHeight),
          p.P2D
        ).parent(renderRef.current);

        removeFunction = p.remove; // Store the remove() function
      }

      p.draw = () => {
        p.frameRate(Constants.frameRate);
        p.noSmooth();
        p.clear();

        // Draw the cursor
        if( hasCursor.current && showCursor.current ){
          // Increment the transition amount
          transitionAmount.current = updateTransition(transitionAmount.current, transitionDuration, true);

          // Update the cursor's dynamic parameters
          updateCursorParams();

          // Draw the cursor
          drawCursor(p);
        }
      }
    });
  }



  /*-------------------------------------------------------*/
  /* CURSOR
  /*-------------------------------------------------------*/

  // Draw the cursor
  const drawCursor = (context) => {
    const posX = roundToPixel(context.width / 2) - (Constants.pixelDensity / 2);
    const posY = roundToPixel(context.height / 2) - (Constants.pixelDensity / 2);

    context.strokeCap(context.PROJECT);
    context.strokeWeight(Constants.pixelDensity);
    context.stroke(Constants.bodyColor);
    context.noFill();
    context.rectMode(context.CENTER);

    // Crosshair
    const crosshairInnerSize = pixelDim(cursor.current.targetBoxSize + (2 * cursor.current.crosshairGap));
    context.line( // Top line
      posX,
      posY - pixelDim(cursor.current.crosshairHeight / 2),
      posX,
      posY - (crosshairInnerSize / 2)
    );

    context.line( // Bottom line
      posX,
      posY + pixelDim(cursor.current.crosshairHeight / 2),
      posX,
      posY + (crosshairInnerSize / 2)
    );

    context.line(  // Left line
      posX - pixelDim(cursor.current.crosshairWidth / 2),
      posY,
      posX - (crosshairInnerSize / 2),
      posY
    );

    context.line(  // Right line
      posX + pixelDim(cursor.current.crosshairWidth / 2),
      posY,
      posX + (crosshairInnerSize / 2),
      posY
    );


    // Horizontal beams
    context.line ( // Top beam
      posX - pixelDim(cursor.current.beamWidth / 2),
      posY - pixelDim(cursor.current.crosshairHeight / 2),
      posX + pixelDim(cursor.current.beamWidth / 2),
      posY - pixelDim(cursor.current.crosshairHeight / 2)
    );

    context.line ( // Bottom beam
      posX - pixelDim(cursor.current.beamWidth / 2),
      posY + pixelDim(cursor.current.crosshairHeight / 2),
      posX + pixelDim(cursor.current.beamWidth / 2),
      posY + pixelDim(cursor.current.crosshairHeight / 2)
    );


    // Target Box
    context.rect(
      posX,
      posY,
      pixelDim(cursor.current.targetBoxSize),
      pixelDim(cursor.current.targetBoxSize),
      pixelDim(cursor.current.targetBoxCorner)
    );


    // Center Dot
    context.push();
    context.noStroke();
    context.fill(Constants.bodyColor);
    context.rect(
      posX,
      posY,
      Constants.pixelDensity,
      Constants.pixelDensity
    );
    context.pop();
  }

  


  /*-------------------------------------------------------*/
  /* RENDER
  /*-------------------------------------------------------*/
  return (
    <div
      className={styles.cursor}
      ref={renderRef}
      style={{
        width: `${pixelDim(cursorTypes.default.crosshairWidth)}px`,
        height: `${pixelDim(cursorTypes.default.crosshairHeight)}px`,
        '--xPos': `${cursorPos.x}px`,
        '--yPos': `${cursorPos.y}px`,
      }}
      ></div>
  );
}

export default Cursor;