"use client"

import { useGlobalContext } from '@/GlobalContext';
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation';
import { roundCorners } from 'svg-round-corners';

export default function WindowBorder(props) {
  const globalContext = useGlobalContext();
  const pathname = usePathname();
  const styles = props.styles;
  
  const [viewbox, setViewbox] = useState('0 0 0 0');
  const [svgPath, setSvgPath] = useState('');
  const [pathChanging, setPathChanging] = useState(false);
  
  // Draw the initial path, and re-draw on window resize
  useEffect(() => {
    drawSVG();
    window.addEventListener("resize", drawSVG);

    // Clean up before unmounting
    return () => {
      window.removeEventListener("resize", drawSVG);
    }
  }, []);
  
  // Update the path on route change
  useEffect(() => {
    // The path transitions only animate for a short time, to prevent weird behavior when resizing the window.
    setPathChanging(true); // enable animated transitions
    drawSVG(); // Update the border
    setTimeout(() => { // Disable animated transitions
      setPathChanging(false);
    }, 1000);
  }, [pathname]);
  
  
  
  // Define or update the SVG path
  const drawSVG = () => {

    // The layout changes on mobile, so we need to detect that.
    // Reading a pseudo-element allows us to keep all breakpoint
    // definitions in the stylesheets.
    const isMobile = getComputedStyle(document.body, ":after").content == '"mobile"';
    
    // Calculate the padding from the body styles
    const bodyStyles = getComputedStyle(document.body);
    const padding = {
      top: parseInt(bodyStyles.paddingTop),
      bottom: parseInt(bodyStyles.paddingBottom),
      left: parseInt(bodyStyles.paddingLeft),
      right: parseInt(bodyStyles.paddingRight)
    };
    
    // Get the window dimensions
    const windowSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Calculate the dimensions of the border shape
    const shapeSize = {
      width: windowSize.width - padding.left - padding.right,
      height: windowSize.height - padding.top - padding.bottom
    };
    
    // Calculate the dimensions of the title
    const titleBounds = props.titleRef.current?.getBoundingClientRect()
    const titleSize = isMobile ? {
      width: props.showTitle ? titleBounds?.width : 0,
      height: titleBounds?.height
    } : {
      width: titleBounds?.width,
      height: props.showTitle ? titleBounds?.height : 0
    };
    
    
    // Set the SVG viewbox
    setViewbox(`0 0 ${windowSize.width} ${windowSize.height}`);
    
    // Build the inner path
    let newSVGPath = "";
    
    // The intent is to allow for relative positioning, so now we can use the width & height to offset from the right and bottom edges
    let points = [
      [ // Starting in the middle of the bottom helps ensure the corners round properly
        shapeSize.width / 2,
        shapeSize.height
      ],
      [ // Bottom left
        0,
        shapeSize.height
      ],
      [ // Title bottom left
        0,
        isMobile ? titleSize.height + titleSize.width : titleSize.height
      ],
      [ // Title bottom right
        titleSize.width,
        titleSize.height
      ],
      [ // Title top right
        isMobile ? titleSize.width : titleSize.width + titleSize.height,
        0
      ],
      [ // Top right
        shapeSize.width,
        0
      ],
      [ // Bottom right
        shapeSize.width,
        shapeSize.height
      ]
    ];

    // Add points to the path if the title is hidden to ensure the animations work
    if (!props.showTitle) {
      if( isMobile ){
        points.splice(2, 0, [
          0,
          titleSize.height + (titleSize.width / 2)
        ]);
        points.splice(5, 0, [
          titleSize.width,
          titleSize.height - padding.top
        ]);

      } else {
        points.splice(3, 0, [
          titleSize.width - padding.top,
          titleSize.height
        ]);
      }
    }
    
    // Add each point to the path string
    for( let i = 0; i < points.length; i++ ) {
      const command = i == 0 ? 'M' : 'L';
      const newPoint = points[i];
      newSVGPath += `${command} ${newPoint[0] + padding.left},${newPoint[1] + padding.top} `;
    }
    
    // Close the path using the first point
    newSVGPath += `Z ${points[0][0] + padding.left},${points[0][1] + padding.top} `;
    
    // Apply the rounded corners
    const roundedPath = roundCorners(newSVGPath, padding.top, false);
    
    // Add outer rectangle after rounding corners
    // We add 10px so the stroke color only appears in the cutout
    const outerRect = `M -10,-10 L ${windowSize.width + 10},-10 L ${windowSize.width + 10},${windowSize.height + 10} L -10,${windowSize.height + 10} L -10,-10`;
    
    setSvgPath(roundedPath.path + outerRect);
    document.body.style.setProperty('--pageTitleNominalDim', `${isMobile ? titleSize.width : titleSize.height}px`); // Set the associated CSS property on the body so page padding can be calculated
  }
  
  return (
    <svg
      className={styles.border}
      viewBox={viewbox}
      xmlns="http://www.w3.org/2000/svg"
      >
      <path
        className={pathChanging ? styles.animate : ''}
        d={svgPath}
        fillRule="evenodd"
        />
    </svg>
  );
}