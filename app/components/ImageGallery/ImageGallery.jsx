'use client'

import { useEffect, useState, useRef } from "react";
import p5 from 'p5';
import {
  roundToPixel,
  dither,
} from '@/utils/drawing';
import * as Constants from '@/Constants';

import styles from "./imageGallery.module.scss";

const ImageGallery = (props) => {
  const listRef = useRef();
  const renderRef = useRef();
  const [initialized, setInitialized] = useState(false);
  const [items, setItems] = useState(props.items);
  
  // Initial setup
  useEffect(() => {
    if( !initialized ){
      setInitialized(true);

      // Add a random rotation to each item
      let mutableItems = items;
      mutableItems.forEach((item) => {
        item.rotation = Math.random() * 30 - 15;
      });
      setItems(mutableItems);

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

        // When the window resizes, update the drawing parameters
        window.addEventListener("resize", () => {
          const calculatedWidth = Math.round(Math.floor(window.innerWidth) / Constants.pixelDensity) * Constants.pixelDensity;
          const calculatedHeight = Math.round(Math.floor(window.innerHeight) / Constants.pixelDensity) * Constants.pixelDensity;
          p.resizeCanvas(calculatedWidth, calculatedHeight);
        });

        // Add a preloaded p5js image element to each entry
        let mutableItems = items;
        mutableItems.forEach((item) => {
          item.image = p.loadImage(item.src);
        });
        setItems(mutableItems);
      }

      p.draw = () => {
        p.frameRate(30);
        p.noSmooth();
        p.clear();
        p.fill(255);
        p.noStroke();
        
        drawImages(p);
      }
    });
  }

  const drawImages = (context) => {
    const listItems = listRef.current.children;
    context.angleMode(context.DEGREES);

    listItems.forEach((listItem) => {
      // Calculate the parameters
      const imageElem = listItem.querySelector('img');
      const imageEntry = items.find((item) => item.src == imageElem.src);
      const itemStyles = getComputedStyle(imageElem);
      imageEntry.image.resize(parseInt(itemStyles.width), parseInt(itemStyles.height));
      
      // Draw the image
      context.push();
      context.translate(roundToPixel(imageElem.getBoundingClientRect().x), roundToPixel(imageElem.getBoundingClientRect().y));
      context.rotate(imageEntry.rotation);
      context.image(imageEntry.image, 0, 0);
      context.pop();
    });

    // Apply dither effect
    dither(context, Constants.accentColor, Constants.fgColor, 60, true);
  }

  return (
    <div className={styles.imageGallery} ref={renderRef} >
      <ul ref={listRef}>
        {items.map((item, index) => {
          return(
            <li key={index}>
              <img
                src={item.src}
                />
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default ImageGallery;