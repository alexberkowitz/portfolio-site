'use client'

import { useEffect, useState, useRef } from "react";
import p5 from 'p5';
import { dither, ease, updateTransition } from '@/utils/drawing';
import * as Constants from '@/Constants';

import styles from "./modelView.module.scss";

const ModelView = (props) => {
  const renderRef = useRef();
  const [initialized, setInitialized] = useState(false);
  const ready = useRef(false);
  const transitionAmount = useRef(0);

  // 3D model viewer
  let viewportBuffer;
  let mesh;
  
  // Initial setup
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);
      
      drawP5(); // Start the drawing
    }
  }, []);


  
  /*-------------------------------------------------------*/
  /* SETUP
  /*-------------------------------------------------------*/
  const drawP5 = () => {
    new p5(p => {
      p.preload = () => {
        mesh = p.loadModel(props.model, true);
      }

      p.setup = () => {
        const canvasDimensions = renderRef.current.getBoundingClientRect();
        let canvas = p.createCanvas(
          canvasDimensions.width,
          canvasDimensions.height,
          p.P2D
        );

        canvas.parent(renderRef.current);
        p.pixelDensity(1 / Constants.pixelDensity);

        // Graphics buffers
        viewportBuffer = p.createGraphics(p.width, p.height, p.WEBGL);

        // Sometimes the canvas doesn't start the right size so we nudge it
        setTimeout(() => {
          setCanvasBounds(p, [viewportBuffer]);
        }, 300);

        // When the window resizes, update the drawing parameters
        // window.addEventListener("resize", () => {
        //   setCanvasBounds(p, [viewportBuffer]);
        // });
      }

      p.draw = () => {
        p.frameRate(Constants.frameRate);
        p.clear();

        renderScene(viewportBuffer, p);
        p.image(viewportBuffer, 0, 0);

        // Fade-in once the canvas and buffers are resized properly
        if( ready.current ){
          transitionAmount.current = updateTransition(transitionAmount.current, 1, true);
        }
        p.background(255, 255, 255, 255 * (1 - transitionAmount.current));

        // Apply dither effect
        const bgColor = [0, 0, 0, 0]; // Transparent
        dither(p, Constants.fgColor, bgColor, 60, true);
      }
    });
  }



  /*-------------------------------------------------------*/
  /* 3D SCENE RENDER
  /*-------------------------------------------------------*/
  const renderScene = (context, p) => {
    context.frameRate(Constants.frameRate);
    context.clear();

    // A variable unit based on a square that is contained by the cavnas
    const units = (value) => {
      return Math.min(context.width, context.height) * value / 100; // Percentages for ease ( e.g. 50% = units(50) )
    }

    // Lighting
    context.ambientLight(32, 32, 32);
    context.pointLight(
      200,
      200,
      200,
      units(-20),
      units(-40),
      200
    );

    context.pointLight(
      64,
      64,
      64,
      units(50),
      units(50),
      200
    );

    // context.specularMaterial(128);
    // context.shininess(1);
    context.fill(64);
    context.noStroke();
    
    // Draw the shape.
    context.push();
    const maxRotation = 45; // Degrees in either direction
    const rotationAmount = {
      x: ((p.mouseX / p.width) - 0.5) * maxRotation * (Math.PI / 180),
      y: ((p.mouseY / p.height) - 0.5) * maxRotation * (Math.PI / 180) * -1
    }
    context.rotateY(rotationAmount.x);
    context.rotateX(rotationAmount.y);
    
    // context.model(mesh);
    context.sphere(units(10));
    context.torus(units(30), units(10), 64, 32);
    context.pop();
  }



  /*-------------------------------------------------------*/
  /* UTILITY FUNCTIONS
  /*-------------------------------------------------------*/
  const setCanvasBounds = (p, buffers) => {
    const canvasDimensions = renderRef.current.getBoundingClientRect();
    p.resizeCanvas(canvasDimensions.width, canvasDimensions.height);

    buffers.forEach((buffer) => {
      buffer.resizeCanvas(p.width, p.height);
    });

    ready.current = true;
  }

  const p2dToWebGL = (p2dX, p2dY, p2dWidth, p2dHeight) => {
    // Assuming WEBGL canvas is centered in the same size canvas as P2D
    let webglX = p2dX - p2dWidth / 2;
    let webglY = p2dY - p2dHeight / 2;
    
    return {
      x: webglX,
      y: webglY
    };
  }
  


  /*-------------------------------------------------------*/
  /* RENDER
  /*-------------------------------------------------------*/
  return (
    <div className={styles.modelView} ref={renderRef}></div>
  );
}

export default ModelView;