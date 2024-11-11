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

  // Transition
  const transitionAmount = useRef(globalContext.transition.current.active ? 1 : 0);
  
  // Cursor
  const targetMinSize = 3 * Constants.pixelDensity;
  const hoverCorner = Constants.interactiveCornerRadius;
  const targetPadding = 10; // In pixel-density units
  const hoverDuration = .3; // In seconds

  const cursorPos = useRef({x: 0, y: 0}); // Local copy of the global cursorPos variable
  const showCursor = useRef(true);
  const hoverActive = useRef(globalContext.hover.active);
  const hoverAmount = useRef(0);
  const scrollOffset = useRef(0); // Additional offset to compensate for scrolling
  const currentTarget = useRef({x: 0, y: 0, w: targetMinSize, h: targetMinSize});
  const prevTarget = useRef({x: 0, y: 0, w: targetMinSize, h: targetMinSize});
  const targetBox = useRef({x: 0, y: 0, w: 0, h: 0, corner: 0});

  // Graphics buffers
  let transitionBuffer;
  let cursorBuffer;
  
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

      // We need to calculate how much a user scrolls so we can compensate.
      // Since the hover target doesn't change when scrolling, we don't get
      // updated coordinates in real-time.
      let initialScroll = window.scrollY;
      window.addEventListener('scroll', () => {
        scrollOffset.current = initialScroll - window.scrollY;
      });
      window.addEventListener('scrollend', () => {
        initialScroll = window.scrollY;
        scrollOffset.current = 0;
      });

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
        p.frameRate(Constants.frameRate);
        p.noSmooth();
        p.clear();

        // Save the cursor pos to globalContext to enable other effects
        cursorPos.current = {x: p.mouseX, y: p.mouseY};
        
        // Draw the transition
        drawTransition(transitionBuffer, p);
        p.image(transitionBuffer, 0, 0);

        // Draw the cursor
        if( showCursor.current ){
          cursorBuffer.noSmooth();
          cursorBuffer.clear();
          drawTargetBox(cursorBuffer);
          drawCrosshair(cursorBuffer);
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
    const transitionDuration = Constants.transitionDuration * Constants.frameRate; // Converting ms to frames
    transitionAmount.current = updateTransition(transitionAmount.current, transitionDuration, transition.active);
    
    if( transitionAmount.current > 0 ){
      context.background(255);
      context.fill(0);
      const transitionSize = context.lerp(
        0,
        transitionEndSize,
        ease(transitionAmount.current, 'easeOut', 5)
      );
      context.circle(
        transition.x,
        transition.y,
        transitionSize
      );
  
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

  // Draw the crosshair
  const drawCrosshair = (context) => {
    context.strokeCap(context.PROJECT);
    context.strokeWeight(Constants.pixelDensity);
    context.stroke(Constants.bodyColor);
    
    const posX = pixelCoord(cursorPos.current.x, context.width);
    const posY = pixelCoord(cursorPos.current.y, context.height);

    // Crosshair
    const crosshairSize = pixelDim(24);
    const crosshairInnerSize = pixelDim(12);
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


  // Update target coordinates when the hover target changes
  useEffect(() => {
    hoverActive.current = globalContext.hover.active;
    hoverAmount.current = 0; // Reset the animiation timer

    // Compare the globalContext hover values with the current ones
    const globalContextHoverVal = {
      x: Math.round(globalContext.hover.x),
      y: Math.round(globalContext.hover.y),
      w: Math.round(globalContext.hover.w) + (2 * targetPadding),
      h: Math.round(globalContext.hover.h) + (2 * targetPadding),
      active: Math.round(globalContext.hover.active),
      corner: hoverCorner,
      isFixed: globalContext.hover.isFixed
    };

    prevTarget.current = targetBox.current;
    currentTarget.current = hoverActive.current ? globalContextHoverVal : cursorPos.current;
  }, [globalContext.hover]);


  // Draw the target box
  const drawTargetBox = (context) => {

    // If there's no hover target, place the box around the cursor.
    if( !hoverActive.current ){
      currentTarget.current = {
        x: cursorPos.current.x,
        y: cursorPos.current.y,
        w: targetMinSize,
        h: targetMinSize,
        corner: 0,
        isFixed: false
      }
    }

    // Increment the hoverAmount
    hoverAmount.current = updateTransition(hoverAmount.current, hoverDuration, true);

    targetBox.current = {
      x: context.lerp(
        prevTarget.current.x,
        currentTarget.current.x,
        ease(hoverAmount.current, 'sine')
      ),
      y: context.lerp(
        prevTarget.current.y,
        currentTarget.current.y,
        ease(hoverAmount.current, 'sine')
      ),
      w: context.lerp(
        prevTarget.current.w,
        currentTarget.current.w,
        ease(hoverAmount.current, 'sine')
      ),
      h: context.lerp(
        prevTarget.current.h,
        currentTarget.current.h,
        ease(hoverAmount.current, 'sine')
      ),
      corner: context.lerp(
        prevTarget.current.corner,
        currentTarget.current.corner,
        ease(hoverAmount.current, 'sine')
      ),
      isFixed: currentTarget.current.isFixed
    };

    context.rectMode(context.CENTER);
    context.strokeCap(context.PROJECT);
    context.strokeWeight(Constants.pixelDensity);
    context.stroke(Constants.bodyColor);
    if( !hoverActive.current && hoverAmount.current === 1 ){
      context.fill(Constants.accentColor);
    } else {
      context.noFill();
    }

    context.rect(
      pixelCoord(targetBox.current.x, context.width),
      pixelCoord(targetBox.current.y, context.height) + (hoverActive.current && !targetBox.current.isFixed ? scrollOffset.current : 0),
      pixelDim(roundToPixel(targetBox.current.w / Constants.pixelDensity)),
      pixelDim(roundToPixel(targetBox.current.h / Constants.pixelDensity)),
      targetBox.current.corner
    );
  }

  


  /*-------------------------------------------------------*/
  /* RENDER
  /*-------------------------------------------------------*/
  return (
    <div className={styles.overlay} ref={renderRef}></div>
  );
}

export default Overlay;