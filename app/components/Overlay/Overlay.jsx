'use client'

import { useEffect, useState, useRef } from "react";
import { useGlobalContext } from '@/GlobalContext';
import p5 from 'p5';
import {
  roundToPixel,
  pixelCoord,
  pixelDim,
  updateTransition,
  dither,
  ease
} from '@/utils/drawing';
import * as Constants from '@/Constants';

import styles from "./overlay.module.scss";

const Overlay = () => {
  const globalContext = useGlobalContext();
  const renderRef = useRef();
  const [initialized, setInitialized] = useState(false);

  const transitionAmount = useRef(globalContext.transition.current.active ? 1 : 0);
  
  const [hasCursor, setHasCursor] = useState(true);
  const showCursor = useRef(true);
  const hoverAmount = useRef(globalContext.hover.active ? 1 : 0);

  // Graphics buffers
  let transitionBuffer;
  let cursorBuffer;
  
  // Initial setup
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);

      // Don't show the cursor if the user is using a touch screen
      if( !window.matchMedia('(pointer: fine)').matches ){
        setHasCursor(false);
      }

      // Users with a mouse will see a cursor trail.
      // Users with a touchscreen will see a touch effect.
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

  const drawP5 = () => {
    /*-------------------------------------------------------*/
    /* SETUP
    /*-------------------------------------------------------*/
    new p5(p => {
      p.setup = () => {
        p.createCanvas(Math.floor(window.innerWidth), Math.floor(window.innerHeight)).parent(renderRef.current);
        p.pixelDensity(1 / Constants.pixelDensity);

        // Graphics Buffers
        transitionBuffer = p.createGraphics(p.width, p.height, p.P2D);
        cursorBuffer = p.createGraphics(p.width, p.height, p.WEBGL);

        // When the window resizes, update the drawing parameters
        window.addEventListener("resize", () => {
          const calculatedWidth = Math.round(Math.floor(window.innerWidth) / Constants.pixelDensity) * Constants.pixelDensity;
          const calculatedHeight = Math.round(Math.floor(window.innerHeight) / Constants.pixelDensity) * Constants.pixelDensity;
          p.resizeCanvas(calculatedWidth, calculatedHeight);
          transitionBuffer.resizeCanvas(calculatedWidth, calculatedHeight);
          cursorBuffer.resizeCanvas(calculatedWidth, calculatedHeight);
        });
      }

      p.draw = () => {
        p.frameRate(30);
        p.noSmooth();
        p.clear();
        
        // Draw the transition
        drawTransition(transitionBuffer, p);
        p.image(transitionBuffer, 0, 0);

        // Draw the cursor
        if( hasCursor && showCursor.current ){
          drawCursor(cursorBuffer, p);
          p.image(cursorBuffer, 0, 0, p.width, p.height);
        }
      }
    });
  }



  /*-------------------------------------------------------*/
  /* TRANSITIONS
  /*-------------------------------------------------------*/

  const drawTransition = (context, p) => {
    const transition = globalContext.transition.current;

    // The default center point for the transition is the cursor position
    transition.x = transition.x === undefined ? p.mouseX : transition.x;
    transition.y = transition.y === undefined ? p.mouseY : transition.y;

    const blurAmount = 50;
    const triangleA = Math.max(transition.x, context.width - transition.x);
    const triangleB = Math.max(transition.y, context.width - transition.y);
    const transitionEndSize = (Math.sqrt(triangleA ** 2 + triangleB ** 2) + (blurAmount * 2)) * 2;
    
    // Animate the transition in or out
    const transitionDuration = Constants.transitionDuration * 30; // Converting ms to frames
    transitionAmount.current = updateTransition(transitionAmount.current, transitionDuration, transition.active);
    
    if( transitionAmount.current > 0 ){
      context.background(255);
      context.fill(0);
      const transitionSize = context.lerp(
        0,
        transitionEndSize,
        ease(transitionAmount.current, 'easeOut', 5)
      );
      context.circle(transition.x, transition.y, transitionSize);
  
      // Apply blur
      context.filter(context.BLUR, blurAmount);
  
      // Apply dither effect
      const bgColor = [0, 0, 0, 0]; // Transparent
      dither(context, Constants.fgColor, bgColor, 150, true);
    } else {
      context.clear();
    }
  }



  /*-------------------------------------------------------*/
  /* CURSOR
  /*-------------------------------------------------------*/
  
  const drawCursor = (context, p) => {
    const pixelDensity = Constants.pixelDensity;
    const strokeWeight = pixelDensity;
    const hover = globalContext.hover.current;
    
    context.clear();
    context.noSmooth();
    context.strokeWeight(strokeWeight);
    context.strokeCap(context.PROJECT);
    context.stroke(Constants.bodyColor);
    context.noFill();

    const mousePos = { // Round coordinates so pixels are always clear
      x: pixelCoord(p.mouseX, p.width),
      y: pixelCoord(p.mouseY, p.height)
    }

    // Animate the transition in or out
    const transitionDuration = 10; // In frames
    hoverAmount.current = updateTransition(hoverAmount.current, transitionDuration, hover.active);


    // Hover elements
    const hoverColor = !!hover.color ? hover.color : Constants.accentColor;
    context.stroke(hoverAmount.current === 0 ? Constants.bodyColor : hoverColor);
    context.fill(Constants.accentColor[0], Constants.accentColor[1], Constants.accentColor[2], hoverAmount.current === 0 ? 255 : 0);
    const targetBoxMinSize = pixelDim(4);
    const targetBox = {
      x: context.lerp(
          mousePos.x,
          pixelCoord(hover.x, p.width) + roundToPixel(hover.w / 2),
          ease(hoverAmount.current, 'inOutCubic')
        ),
      y: context.lerp(
          mousePos.y,
          pixelCoord(hover.y - Constants.pixelDensity, p.height) + roundToPixel(hover.h / 2),
          ease(hoverAmount.current, 'inOutCubic')
        ),
      w: roundToPixel(
          context.lerp(
            targetBoxMinSize,
            hover.w,
            ease(hoverAmount.current, 'inOutCubic')
          )
        ),
      h: roundToPixel(
          context.lerp(
            targetBoxMinSize,
            hover.h,
            ease(hoverAmount.current, 'inOutCubic')
          )
        ),
      corner: context.lerp(
        0,
        Constants.interactiveCornerRadius,
        ease(hoverAmount.current, 'inOutCubic')
      ),
    };

    context.rectMode(context.CENTER);
    context.rect(targetBox.x, targetBox.y, targetBox.w, targetBox.h, targetBox.corner, targetBox.corner, targetBox.corner, targetBox.corner);


    // Crosshair
    context.stroke(Constants.bodyColor);
    const crosshairSize = pixelDim(20);
    const crosshairInnerSize = pixelDim(12);
    context.line(mousePos.x, mousePos.y - (crosshairSize / 2), // Top line
                 mousePos.x, mousePos.y - (crosshairInnerSize / 2),);

    context.line(mousePos.x, mousePos.y + (crosshairSize / 2), // Bottom line
                 mousePos.x, mousePos.y + (crosshairInnerSize / 2),);

    context.line(mousePos.x - (crosshairSize / 2), // Left line
                 mousePos.y, mousePos.x - (crosshairInnerSize / 2),
                 mousePos.y,);

    context.line(mousePos.x + (crosshairSize / 2), // Right line
                 mousePos.y, mousePos.x + (crosshairInnerSize / 2),
                 mousePos.y,);
    

    // Center Dot
    context.noStroke();
    context.fill(Constants.bodyColor);
    context.rect(mousePos.x, mousePos.y, Constants.pixelDensity, Constants.pixelDensity);
  }
  


  return (
    <div className={styles.overlay} ref={renderRef}></div>
  );
}

export default Overlay;