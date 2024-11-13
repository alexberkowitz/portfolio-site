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
  const cursorPos = useRef({x: 0, y: 0});
  const showCursor = useRef(true);
  
  // Initial setup
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);

      // Users without a mouse won't see the cursor
      if( !window.matchMedia('(pointer: fine)').matches ){
        showCursor.current = false;
      } else {
        // Only show the cursor when it is over the document
        // to avoid the image being "left behind"
        document.addEventListener("mouseleave", () => {
          showCursor.current = false;
        });
        document.addEventListener("mouseenter", () => {
          showCursor.current = true;
        });
      }

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
          Math.floor(window.innerWidth),
          Math.floor(window.innerHeight)
        ).parent(renderRef.current);
        p.pixelDensity(1 / Constants.pixelDensity);

        // When the window resizes, update the drawing parameters
        window.addEventListener("resize", () => {
          p.resizeCanvas(window.innerWidth, window.innerHeight);
        });
      }

      p.draw = () => {
        p.frameRate(Constants.frameRate);
        p.noSmooth();
        p.clear();

        // Store the cursor pos
        cursorPos.current = {x: p.mouseX, y: p.mouseY};

        // Draw the cursor
        if( showCursor.current ){
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
    
    const posX = roundToPixel(cursorPos.current.x) - (Constants.pixelDensity / 2);
    const posY = roundToPixel(cursorPos.current.y) - (Constants.pixelDensity / 2);

    // Crosshair
    const crosshairSize = pixelDim(24);
    const crosshairInnerSize = pixelDim(12);
    if( globalContext.cursorState.current !== 'hover' ){
      context.line( // Top line
        posX,
        posY - (crosshairSize / 2),
        posX,
        posY - (crosshairInnerSize / 2)
      );

      context.line( // Bottom line
        posX,
        posY + (crosshairSize / 2),
        posX,
        posY + (crosshairInnerSize / 2)
      );

      context.line(  // Left line
        posX - (crosshairSize / 2),
        posY,
        posX - (crosshairInnerSize / 2),
        posY
      );
  
      context.line(  // Right line
        posX + (crosshairSize / 2),
        posY,
        posX + (crosshairInnerSize / 2),
        posY
      );
    }


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
    <div className={styles.cursor} ref={renderRef}></div>
  );
}

export default Cursor;