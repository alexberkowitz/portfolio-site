'use client'

import { useEffect, useState, useRef } from "react";
import { useGlobalContext } from '@/GlobalContext';
import p5 from 'p5';
import { dither } from '@/utils/drawing';

import styles from "./overlay.module.scss";

const Overlay = (props) => {
  const globalContext = useGlobalContext();
  const renderRef = useRef();
  const [initialized, setInitialized] = useState(false);
  const transitionActive = useRef(globalContext.transition);
  const [hasCursor, setHasCursor] = useState(true);
  const showCursor = useRef(true);
  const transitionAmount = useRef(globalContext.transition ? 1 : 0);

  let transitionBuffer;
  
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

  useEffect(() => {
    transitionActive.current = globalContext.transition;
  }, [globalContext]);

  const drawP5 = () => {
    new p5(p => {
      p.setup = () => {
        p.createCanvas(Math.floor(window.innerWidth), Math.floor(window.innerHeight)).parent(renderRef.current);
        p.pixelDensity(1 / props.pixelDensity);

        // Transition Buffer
        transitionBuffer = p.createGraphics(p.width, p.height, p.P2D);

        // When the window resizes, update the drawing parameters
        window.addEventListener("resize", () => {
          p.resizeCanvas(Math.floor(window.innerWidth), Math.floor(window.innerHeight));
        });
      }

      p.draw = () => {
        p.frameRate(30);
        p.clear();
        
        // Draw the transition
        drawTransition(transitionBuffer);
        p.image(transitionBuffer, 0, 0);

        // Draw the cursor
        if( hasCursor && showCursor.current ){
          drawCursor(p);
        }
      }
    });
  }



  // Apply a transition effect to the page
  const drawTransition = (context) => {
    const blurAmount = 50;
    const transitionDuration = globalContext.transitionDuration * 30; // Converting ms to frames
    const explosionEndSize = (Math.sqrt(Math.pow(context.width, 2), Math.pow(context.height, 2)) + blurAmount) * 2.5;
    
    // Animate the transition in or out
    // Animates from 0 - 1 or 1 - 0
    transitionAmount.current = transitionActive.current ? Math.min(transitionAmount.current + (1 / transitionDuration), 1) : Math.max(transitionAmount.current - (1 / transitionDuration), 0);
    
    context.background(255);
    context.fill(0);
    const explosionSize = context.map(transitionAmount.current, 0, 1, 0, explosionEndSize);
    context.circle(globalContext.transitionPos.current.x, globalContext.transitionPos.current.y, explosionSize);

    // Apply blur
    context.filter(context.BLUR, blurAmount);

    // Apply dither effect
    const bgColor = [0, 0, 0, 0]; // Transparent
    dither(context, props.accentColor, bgColor, 150, props.pixelDensity, true);
  }



  // Draw a crosshair at the cursor location
  const drawCursor = (p) => {
    const cursorSize = 16;
    p.strokeWeight(2);
    p.strokeCap(p.PROJECT);
    p.stroke(0, 0, 0, 255);
    p.fill(0, 0, 0, 0);
    const mousePos = { // Round coordinates so pixels are always clear
      x: 2 * Math.round(p.mouseX / 2) + 1,
      y: 2 * Math.round(p.mouseY / 2) + 1,
    }
    p.line(mousePos.x, mousePos.y - (cursorSize / 2), mousePos.x, mousePos.y + (cursorSize / 2),); // Vertical line
    p.line(mousePos.x- (cursorSize / 2), mousePos.y, mousePos.x + (cursorSize / 2), mousePos.y,); // Horizontal line
  }
  
  return (
    <div className={styles.cursor} ref={renderRef}></div>
  );
}

export default Overlay;