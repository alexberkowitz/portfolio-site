/*-------------------------------------------------------*/
/* 3D MODEL VIEWER
/*-------------------------------------------------------*/
/**
 * Displays a 3D model
 *
 * 
 * PROPS:
 *
 * model: (url) Path of the 3D model
 * texture: (url) Path of a texture file
 * rotationX: (number) Base X rotation value
 * rotationY: (number) Base Y rotation value
 * rotationZ: (number) Base Z rotation value
 * rotationSpeed: (number) Static rotation speed around Y axis in degrees per second
 * xInfluence: (number) Max cursor influence on X rotation in degrees
 * yInfluence: (number) Max cursor influence on Y rotation in degrees
 * scale: (number) Scaling factor
 * text: (string) Text to display if no model is provided
 * dither: (boolean) Whether or not to display the model in a dithered style
 */

'use client'

import { useEffect, useState, useRef } from "react";
import p5 from 'p5';
import { roundToPixel, dither } from '@/utils/drawing';
import * as Constants from '@/Constants';

import styles from "./modelView.module.scss";

const ModelViewer = (props) => {
  const renderRef = useRef();
  const [initialized, setInitialized] = useState(false);
  const [callbackInitiated, setCallbackInitiated] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({w: 0, h: 0});

  let removeFunction; // Storage for the p.remove() function so we can call it from useEffect

  // 3D model viewer
  let viewportBuffer;
  let mesh;
  let texture;
  let font;

  let resizeHandler;
  
  // Initial setup
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);
      
      drawP5(); // Start the drawing
    }

    // Clean up before unmounting
    return () => {
      removeFunction();
      window.removeEventListener("resize", resizeHandler);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Optional callback after model loads
  useEffect(() => {
    if( props.callback && callbackInitiated ){
      props.callback();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callbackInitiated]);


  
  /*-------------------------------------------------------*/
  /* SETUP
  /*-------------------------------------------------------*/
  const drawP5 = () => {
    new p5(p => {
      p.preload = () => {
        if( !!props.model ){
          mesh = p.loadModel(props.model, {
            normalize: true
          });
        }

        if( !!props.texture ){
          texture = p.loadImage(props.texture);
        }

        font = p.loadFont('/fonts/c64_mono.ttf');
      }

      p.setup = () => {
        const canvasBoundingRect = renderRef.current.getBoundingClientRect();
        setCanvasDimensions({w: canvasBoundingRect.width, h: canvasBoundingRect.height});
        let canvas = p.createCanvas(
          roundToPixel(canvasBoundingRect.width, 'floor'),
          roundToPixel(canvasBoundingRect.height, 'floor'),
          p.P2D
        );

        canvas.parent(renderRef.current);
        if( props.dither ){
          p.pixelDensity(1 / Constants.pixelDensity);
        }

        // Graphics buffers
        viewportBuffer = p.createGraphics(p.width, p.height, p.WEBGL);

        // Sometimes the canvas doesn't start the right size so we nudge it
        setTimeout(() => {
          setCanvasBounds(p, [viewportBuffer]);
        }, 300);

        // When the window resizes, update the drawing parameters
        resizeHandler = setCanvasBounds.bind(null, p, [viewportBuffer]);
        window.addEventListener("resize", resizeHandler);

        removeFunction = p.remove; // Store the remove() function
      }

      p.draw = () => {
        p.frameRate(Constants.frameRate);
        p.clear();

        // Draw the model
        renderScene(viewportBuffer, p);
        p.image(viewportBuffer, 0, 0);

        // Apply dither effect
        if( props.dither ){
          dither(p, Constants.fgColor, Constants.bgColor, true);
        }

        setCallbackInitiated(true);
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
    context.angleMode(context.DEGREES);
    context.fill(64);
    context.noStroke();
    
    context.push();
    const maxRotationX = props.xInfluence || 0; // Degrees in either direction
    const maxRotationY = props.yInfluence || 0; // Degrees in either direction
    const rotationAmount = {
      x: ((p.mouseY / p.height) - 0.5) * maxRotationX * -1,
      y: ((p.mouseX / p.width) - 0.5) * maxRotationY
    }
    context.rotateX(rotationAmount.x + props.rotationX);
    context.rotateY(rotationAmount.y + props.rotationY);
    context.rotateZ(props.rotationZ);

    switch( props.rotationAxis?.toLowerCase() || 'y' ){
      case 'x':
        context.rotateX(baseAngle + rotationAmount.x + props.rotationX);
        break;
      case 'y':
        context.rotateY(baseAngle + rotationAmount.y + props.rotationY);
        break;
      case 'z':
        context.rotateZ(baseAngle + props.rotationZ);
        break;
    }
    
    // Apply texture
    if( !!texture ){
      context.texture(texture);
    } else {
      context.fill(128);
    }

    // Display mesh
    if( !!mesh ){
      // Scale the mesh to fix the canvas
      const meshBounds = mesh.calculateBoundingBox().max;
      const meshScaleFactors = [ // Calculate scaling factors based on the container size
        context.width / meshBounds.x / Constants.pixelDensity, // X
        context.width / meshBounds.y / Constants.pixelDensity, // Y
        context.height / meshBounds.z / Constants.pixelDensity // Z
      ];
      context.scale(context.min(meshScaleFactors));

      // Additional scaling if defined
      if( props.scale ){
        context.scale(props.scale);
      }

      // Render the mesh
      context.model(mesh);

    // Display text
    } else {
      context.textFont(font);
      context.textAlign(context.CENTER, context.CENTER);
      context.textSize(units(props.scale));

      const textDepth = 20;
      const textOffset = 5;
      context.translate(0, 0, textDepth * textOffset / -2);
      for( let i = 0; i < textDepth; i++ ) {
        context.fill(context.map(i, 0, textDepth, 255, 0));
        context.translate(0, 0, textOffset);
        context.text(props.text || "Something went wrong!", 0, 0);
      }
    }
    context.pop();

    // Increment the angle to enable rotation
    const rotationSpeed = props.rotationSpeed || 0;
    baseAngle += rotationSpeed / Constants.frameRate;


    // Lighting
    context.ambientLight(16, 16, 16);
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
  }



  /*-------------------------------------------------------*/
  /* UTILITY FUNCTIONS
  /*-------------------------------------------------------*/
  const setCanvasBounds = (p, buffers) => {
    const canvasBoundingRect = renderRef?.current?.getBoundingClientRect();
    setCanvasDimensions({w: canvasBoundingRect.width, h: canvasBoundingRect.height});
    p.resizeCanvas(canvasBoundingRect.width, canvasBoundingRect.height);

    buffers.forEach((buffer) => {
      buffer.resizeCanvas(p.width, p.height);
    });
  }
  


  /*-------------------------------------------------------*/
  /* RENDER
  /*-------------------------------------------------------*/
  return (
    <div
      className={styles.modelView}
      ref={renderRef}
      title={props.text || ''}
      style={{
        '--w': `${roundToPixel(canvasDimensions.w)}px`,
        '--h': `${roundToPixel(canvasDimensions.h)}px`
      }}
      ></div>
  );
}

export default ModelViewer;