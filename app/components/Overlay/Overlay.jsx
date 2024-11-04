'use client'

import { useEffect, useState, useRef } from "react";
import { useGlobalContext } from '@/GlobalContext';
import p5 from 'p5';
import { dither, ease } from '@/utils/drawing';

import styles from "./overlay.module.scss";

const Overlay = (props) => {
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
        p.pixelDensity(1 / props.pixelDensity);

        // Graphics Buffers
        transitionBuffer = p.createGraphics(p.width, p.height, p.P2D);
        cursorBuffer = p.createGraphics(p.width, p.height, p.WEBGL);

        // When the window resizes, update the drawing parameters
        window.addEventListener("resize", () => {
          const calculatedWidth = Math.round(Math.floor(window.innerWidth) / props.pixelDensity) * props.pixelDensity;
          const calculatedHeight = Math.round(Math.floor(window.innerHeight) / props.pixelDensity) * props.pixelDensity;
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
        drawTransition(transitionBuffer);
        p.image(transitionBuffer, 0, 0);

        // Draw the cursor
        if( hasCursor && showCursor.current ){
          drawCursor(cursorBuffer, p);
          p.image(cursorBuffer, 0, 0);
        }
      }
    });
  }



  /*-------------------------------------------------------*/
  /* TRANSITIONS
  /*-------------------------------------------------------*/

  const drawTransition = (context) => {
    const transition = globalContext.transition.current;
    const blurAmount = 50;
    const transitionDuration = globalContext.transitionDuration * 30; // Converting ms to frames
    const explosionEndSize = (Math.sqrt(Math.pow(context.width, 2), Math.pow(context.height, 2)) + blurAmount) * 2.5;
    
    // Animate the transition in or out
    // Animates from 0-1 or 1-0
    transitionAmount.current = transition.active ?
      Math.min(transitionAmount.current + (1 / transitionDuration), 1)
      : Math.max(transitionAmount.current - (1 / transitionDuration), 0);
    
    if( transitionAmount.current > 0 ){
      context.background(255);
      context.fill(0);
      const explosionSize = context.map(transitionAmount.current, 0, 1, 0, explosionEndSize);
      context.circle(transition.x, transition.y, explosionSize);
  
      // Apply blur
      context.filter(context.BLUR, blurAmount);
  
      // Apply dither effect
      const bgColor = [0, 0, 0, 0]; // Transparent
      dither(context, props.fgColor, bgColor, 150, props.pixelDensity, true);
    } else {
      context.clear();
    }
  }



  /*-------------------------------------------------------*/
  /* CURSOR
  /*-------------------------------------------------------*/
  
  const drawCursor = (context, p) => {
    const strokeWeight = 1 * props.pixelDensity;
    const hover = globalContext.hover.current;
    
    context.clear();
    context.noSmooth();
    context.strokeWeight(strokeWeight);
    context.strokeCap(context.PROJECT);
    context.stroke(0, 0, 0, 255);
    context.noFill();

    const mousePos = { // Round coordinates so pixels are always clear
      x: props.pixelDensity * Math.round(p.mouseX / props.pixelDensity) - Math.round(context.width / 2) - Math.round(props.pixelDensity / 2) + (props.pixelDensity/2),
      y: props.pixelDensity * Math.round(p.mouseY / props.pixelDensity) - Math.round(context.height / 2) - Math.round(props.pixelDensity / 2),
    }

    // Animate the transition in or out
    // Animates from 0-1 or 1-0
    const transitionDuration = 10; // In frames
    hoverAmount.current = hover.active ?
      Math.min(hoverAmount.current + (1 / transitionDuration), 1)
      : Math.max(hoverAmount.current - (1 / transitionDuration), 0);

    // Crosshair
    const crosshairSize = 14 * props.pixelDensity;
    const crosshairInnerSize = 12 * props.pixelDensity;
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
    context.rect(mousePos.x, mousePos.y, 1,1);

    // Hover elements
    const targetBoxCorner = 999999;
    const targetBoxMinSize = 4 * props.pixelDensity;
    const targetBox = {
      x: context.lerp(mousePos.x, hover.x - (context.width / 2) + (hover.w / 2), ease(hoverAmount.current, 'inOutcubic')),
      y: context.lerp(mousePos.y, hover.y - (context.height / 2) + (hover.h / 2), ease(hoverAmount.current, 'inOutcubic')),
      w: context.lerp(targetBoxMinSize, hover.w, ease(hoverAmount.current, 'inOutCubic')),
      h: context.lerp(targetBoxMinSize, hover.h, ease(hoverAmount.current, 'inOutCubic')),
    };

    context.rectMode(context.CENTER);
    context.rect(targetBox.x, targetBox.y, targetBox.w, targetBox.h, targetBoxCorner, targetBoxCorner, targetBoxCorner, targetBoxCorner);

  }
  


  return (
    <div className={styles.cursor} ref={renderRef}></div>
  );
}

export default Overlay;