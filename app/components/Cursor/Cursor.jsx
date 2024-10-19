'use client'

import { useEffect, useState, useRef } from "react";
import p5 from 'p5';
import styles from "./cursor.module.scss";

const Cursor = (props) => {
  const renderRef = useRef();
  const [initialized, setInitialized] = useState(false);
  
  // Initial setup
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);
      drawP5(); // Start the drawing
    }
  }, [initialized]);

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

        // Draw the cursor
        drawCursor(p);
      }
    });
  }

  const drawCursor = (p) => {
    const cursorSize = 16;
    p.strokeWeight(2);
    p.strokeCap(p.PROJECT);
    p.stroke(0, 0, 0, 255);
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

export default Cursor;