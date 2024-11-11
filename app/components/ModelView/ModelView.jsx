'use client'

import { useEffect, useState, useRef } from "react";
import p5 from 'p5';
import { dither, ease, updateTransition } from '@/utils/drawing';
import * as Constants from '@/Constants';

import styles from "./modelView.module.scss";

const ModelView = (props) => {
  const {model, options} = props;
  const renderRef = useRef();
  const [initialized, setInitialized] = useState(false);
  const ready = useRef(false);
  const transitionAmount = useRef(0);
  const rotationSpeed = 15; // Degrees per second

  // 3D model viewer
  let viewportBuffer;
  let mesh;
  let texture;
  
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
        if( !!model ){
          mesh = p.loadModel(model, true);
        }

        if( !!options.texture ){
          texture = p.loadImage(options.texture);
        }
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
        window.addEventListener("resize", () => {
          setCanvasBounds(p, [viewportBuffer]);
        });
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
        // p.background(128, 128, 128, 255 * ease(1 - transitionAmount.current, 'easeOut', 3));

        // Apply dither effect
        const transparentColor = [0, 0, 0, 0]; // Transparent
        dither(p, Constants.fgColor, options.solid ? Constants.accentColor : transparentColor, 120, true);
      }
    });
  }



  /*-------------------------------------------------------*/
  /* 3D SCENE RENDER
  /*-------------------------------------------------------*/
  let baseAngle = 0;
  const renderScene = (context, p) => {
    context.frameRate(Constants.frameRate);
    context.clear();


    // A variable unit based on a square that is contained by the cavnas
    const units = (value) => {
      return Math.min(context.width, context.height) * value / 100; // Percentages for ease ( e.g. 50% = units(50) )
    }

    
    // Draw the shape.
    context.fill(64);
    context.noStroke();
    
    context.push();
    context.angleMode(context.DEGREES);
    const maxRotation = 45; // Degrees in either direction
    const rotationAmount = {
      x: ((p.mouseY / p.height) - 0.5) * maxRotation * -1,
      y: ((p.mouseX / p.width) - 0.5) * maxRotation
    }
    context.rotateX(rotationAmount.x + props.options?.rotationX);
    context.rotateY(baseAngle + rotationAmount.y + props.options?.rotationY);
    context.rotateZ(180 + props.options?.rotationZ);
    context.scale(props.options?.scale);
    
    if( !!texture ){
      context.texture(texture);
    }
    if( !!mesh ){
      context.model(mesh);
    } else {
      context.sphere(units(2));
      context.torus(units(10), units(3), 64, 32);
    }
    context.pop();


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


    // Increment the angle to enable rotation
    baseAngle += rotationSpeed / Constants.frameRate;
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
  


  /*-------------------------------------------------------*/
  /* RENDER
  /*-------------------------------------------------------*/
  return (
    <div className={styles.modelView} ref={renderRef}></div>
  );
}

export default ModelView;