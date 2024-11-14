'use client'

import { useEffect, useState, useRef } from "react";
import { useGlobalContext } from '@/GlobalContext';
import p5 from 'p5';
import {
  roundToPixel,
  pixelDim,
} from '@/utils/drawing';
import * as Constants from '@/Constants';

import styles from "./cursor.module.scss";

const Cursor = () => {
  const globalContext = useGlobalContext();
  const renderRef = useRef();
  const [initialized, setInitialized] = useState(false);
  
  // Cursor
  const [cursorPos, setCursorPos] = useState({x: 0, y: 0});
  const [showCursor, setShowCursor] = useState(true);
  const cursorSize = pixelDim(23);
  
  // Initial setup
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);

      // If the component fails to load, the cursor styles fall back to the default
      const style = document.createElement("style");
      style.textContent = "* { cursor: none !important; }";
      document.head.appendChild(style);

      // Only show the cursor if one of the following conditions are met:
      // - The user has a mouse and the cursor is within the viewport
      // - The user has a touch device and is touching the screen
      document.addEventListener('mousemove', () => { setShowCursor(true); });
      document.addEventListener('mouseenter', () => { setShowCursor(true); });
      document.addEventListener('touchstart', () => { setShowCursor(true); });
      document.addEventListener('mouseleave', () => { setShowCursor(false); });
      document.addEventListener('touchend', () => { setShowCursor(false); });

      drawP5(); // Start the drawing
    }
  }, [initialized]);

  /*-------------------------------------------------------*/
  /* SETUP
  /*-------------------------------------------------------*/
  const drawP5 = () => {
    new p5(p => {
      p.setup = () => {
        p.createCanvas(
          cursorSize,
          cursorSize,
          p.P2D
        ).parent(renderRef.current);
        p.pixelDensity(1 / Constants.pixelDensity);
      }

      p.draw = () => {
        p.frameRate(Constants.frameRate);
        p.noSmooth();
        p.clear();

        // Get the global cursor pos
        setCursorPos({...globalContext.cursorPos.current});

        // Draw the cursor
        if( showCursor ){
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
    context.strokeCap(context.PROJECT);
    context.strokeWeight(Constants.pixelDensity);
    context.stroke(Constants.bodyColor);
    
    const posX = roundToPixel(context.width / 2) - (Constants.pixelDensity / 2);
    const posY = roundToPixel(context.height / 2) - (Constants.pixelDensity / 2);

    // Crosshair
    const crosshairInnerSize = pixelDim(12);
    context.line( // Top line
      posX,
      0,
      posX,
      posY - (crosshairInnerSize / 2)
    );

    context.line( // Bottom line
      posX,
      context.height,
      posX,
      posY + (crosshairInnerSize / 2)
    );

    context.line(  // Left line
      0,
      posY,
      posX - (crosshairInnerSize / 2),
      posY
    );

    context.line(  // Right line
      context.width,
      posY,
      posX + (crosshairInnerSize / 2),
      posY
    );


    // Center Box
    context.push();
    context.stroke(Constants.bodyColor);
    context.noFill();
    const boxSize = 8;
    context.rect(
      posX - (boxSize / 2),
      posY - (boxSize / 2),
      boxSize,
      boxSize
    );
    context.pop();


    // Center Dot
    context.push();
    context.noStroke();
    context.fill(Constants.bodyColor);
    context.rect(
      posX - (Constants.pixelDensity / 2),
      posY - (Constants.pixelDensity / 2),
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
        width: `${cursorSize}px`,
        height: `${cursorSize}px`,
        transform: `translateX(-${cursorSize / 2}px) translateY(-${cursorSize / 2}px)`,
        '--xPos': `${cursorPos.x}px`,
        '--yPos': `${cursorPos.y}px`,
      }}
      ></div>
  );
}

export default Cursor;