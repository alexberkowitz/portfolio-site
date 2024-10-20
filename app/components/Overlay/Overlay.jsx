'use client'

import { useEffect, useState, useRef } from "react";
import { useGlobalContext } from '@/GlobalContext';
import p5 from 'p5';

import styles from "./overlay.module.scss";

const Overlay = (props) => {
  const globalContext = useGlobalContext();
  const renderRef = useRef();
  const [initialized, setInitialized] = useState(false);
  const transitionActive = useRef(globalContext.transition);
  const [showCursor, setShowCursor] = useState(true);
  const transitionAmount = useRef(globalContext.transition ? 1 : 0);
  
  // Initial setup
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);

      // Don't show the cursor if the user is using a touch screen
      if( !window.matchMedia('(pointer: fine)').matches ){
        setShowCursor(false);
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

        // When the window resizes, update the drawing parameters
        window.addEventListener("resize", () => {
          p.resizeCanvas(Math.floor(window.innerWidth), Math.floor(window.innerHeight));
        });
      }

      p.draw = () => {
        p.frameRate(30);
        p.clear();
        
        // Draw the transition
        drawTransition(p);

        // Draw the cursor
        if( showCursor ){
          drawCursor(p);
        }
      }
    });
  }

  // Apply a transition effect to the page
  const drawTransition = (p) => {
    const transitionDuration = globalContext.transitionDuration * 30; // Converting ms to frames

    // Animate the transition in or out
    transitionAmount.current = transitionActive.current ? Math.min(transitionAmount.current + (1 / transitionDuration), 1) : Math.max(transitionAmount.current - (1 / transitionDuration), 0);

    const transitionTop = p.map (transitionAmount.current, 0, 1, window.innerHeight * -1, 0);

    p.stroke(0, 0, 0, 0);
    p.fill(props.fgColor[0], props.fgColor[1], props.fgColor[2]);
    
    // Draw the rectangle
    p.rect(0, transitionTop, window.innerWidth, window.innerHeight);
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