/*-------------------------------------------------------*/
/* PAGE BORDER
/*-------------------------------------------------------*/
/**
 * Fancy SVG-based page border that animates
 * to hide/show site title and back button
 */

"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation';
import { roundCorners } from '@/utils/roundPathCorners';
import * as Constants from '@/Constants';

export default function WindowBorder(props) {
  const pathname = usePathname();
  const styles = props.styles;
  
  const [viewbox, setViewbox] = useState('0 0 0 0');
  const [svgPath, setSvgPath] = useState('');
  const [pathChanging, setPathChanging] = useState(false);
  
  // Draw the initial path, and re-draw on window resize
  useEffect(() => {
    drawSVG();
    window.addEventListener("resize", updateSVG);

    // Clean up before unmounting
    return () => {
      window.removeEventListener("resize", updateSVG);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Update the path on route change
  useEffect(() => {
    // The path transitions only animate for a short time, to prevent weird behavior when resizing the window.
    setPathChanging(true); // enable animated transitions
    drawSVG(); // Update the border
    setTimeout(() => { // Disable animated transitions
      setPathChanging(false);
    }, Constants.titleDuration * 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);



  // Small function to run the SVG updater twice which
  // is sometimes needed when resizing across breakpoints
  const updateSVG = () => {
    drawSVG();
    setTimeout(() => drawSVG(), 1000);
  }
  
  
  
  // Define or update the SVG path
  const drawSVG = () => {

    // The layout changes on mobile, so we need to detect that.
    // Reading a pseudo-element allows us to keep all breakpoint
    // definitions in the stylesheets.
    const isMobile = getComputedStyle(document.body, ":after").content == '"mobile"';
    
    // Calculate the padding from the body styles
    const bodyStyles = getComputedStyle(document.body);
    const padding = {
      top: parseFloat(bodyStyles.paddingTop),
      bottom: parseFloat(bodyStyles.paddingBottom),
      left: parseFloat(bodyStyles.paddingLeft),
      right: parseFloat(bodyStyles.paddingRight)
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
    const titleBounds = props.titleRef.current?.getBoundingClientRect();
    const titleSize = {
      width: titleBounds?.width,
      height: props.showTitle ? titleBounds?.height : 0
    };
    
    // Calculate the dimensions of the back button
    const backButtonBounds = props.backButtonRef.current?.getBoundingClientRect();
    const backButtonSize = {
      width: backButtonBounds?.width,
      height: props.showBackButton ? backButtonBounds?.height * 1.5 : 0
    };

    // SVGs draw their lines on center, so we need to offset by half of the border width
    // in order to ensure the border lines up properly with other elements
    const posOffset = Constants.pixelDensity / 2;

    // Just like in the CSS, we can get the corner radius as equal to the page padding.
    // Technically it would be better to calculate this from the CSS but honestly
    // it's such a small change to make if I ever decouple those values.
    const cornerRadius = padding.top;
    const minorCornerRadius = 10;
    
    
    // Set the SVG viewbox
    setViewbox(`0 0 ${windowSize.width} ${windowSize.height}`);
    
    // The intent is to allow for relative positioning, so now we can use the width & height to offset from the right and bottom edges
    // First two values are X and Y coords, third is radius
    // 
    let points = isMobile ? [
      [ // Starting along the bottom edge helps ensure the corners round properly
        shapeSize.width - (2 * cornerRadius),
        shapeSize.height + posOffset,
        cornerRadius
      ],
      [ // Back button bottom right
        backButtonSize.width + backButtonSize.height - posOffset,
        shapeSize.height + posOffset,
        minorCornerRadius
      ],
      [ // Back button top right
        backButtonSize.width - posOffset,
        shapeSize.height - backButtonSize.height + posOffset,
        backButtonSize.height === 0 ? cornerRadius : minorCornerRadius
      ],
      [ // Back button top left
        0 - posOffset,
        shapeSize.height - backButtonSize.height + posOffset,
        backButtonSize.height > 0 ? minorCornerRadius : cornerRadius
      ],
      [ // Title bottom left
        0 - posOffset,
        titleSize.height - posOffset,
        cornerRadius
      ],   
      [ // Title bottom right
        titleSize.width - posOffset,
        titleSize.height - posOffset,
        cornerRadius
      ],
      [ // Bottom right
        shapeSize.width + posOffset,
        shapeSize.height + posOffset,
        cornerRadius
      ]
    ] : [
      [ // Starting along the bottom edge helps ensure the corners round properly
        shapeSize.width - (2 * cornerRadius),
        shapeSize.height + posOffset,
        0
      ],
      [ // Back button bottom right
        backButtonSize.width + backButtonSize.height - posOffset,
        shapeSize.height + posOffset,
        minorCornerRadius
      ],
      [ // Back button top right
        backButtonSize.width - posOffset,
        shapeSize.height - backButtonSize.height + posOffset,
        minorCornerRadius
      ],
      [ // Back button top left
        0 - posOffset,
        shapeSize.height - backButtonSize.height + posOffset,
        backButtonSize.height === 0 ? cornerRadius : minorCornerRadius
      ],
      [ // Title bottom left
        0 - posOffset,
        titleSize.height - posOffset,
        titleSize.height === 0 ? cornerRadius : minorCornerRadius
      ],   
      [ // Title bottom right
        titleSize.width - posOffset,
        titleSize.height - posOffset,
        minorCornerRadius
      ],
      [ // Title top right
        titleSize.width + titleSize.height - posOffset,
        0 - posOffset,
        minorCornerRadius
      ],
      [ // Top right
        shapeSize.width + posOffset,
        0 - posOffset,
        cornerRadius
      ],
      [ // Bottom right
        shapeSize.width + posOffset,
        shapeSize.height + posOffset,
        cornerRadius
      ]
    ];

    // Build the inner path and radius lists
    let newSVGPath = "";
    let radii = [];
    
    // Add each point to the path string
    for( let i = 0; i < points.length; i++ ) {
      const command = i == 0 ? 'M' : 'L';
      newSVGPath += `${command} ${Math.round(points[i][0]) + padding.left},${Math.round(points[i][1]) + padding.top} `;
      radii.push(points[i][2]);
    }
    
    // Close the path using the first point
    newSVGPath += `Z ${points[0][0] + padding.left},${points[0][1] + padding.top}`;
    radii.push(points[0][2]);
    
    // Apply the rounded corners
    const roundedPath = roundCorners(newSVGPath, radii, false);
    
    // Add outer rectangle after rounding corners
    // We add 10px so the stroke color only appears in the cutout
    const outerRect = `M -10,-10 L ${windowSize.width + 10},-10 L ${windowSize.width + 10},${windowSize.height + 10} L -10,${windowSize.height + 10} L -10,-10`;
    
    setSvgPath(outerRect + roundedPath);

    // Set the associated CSS properties on the body so page padding can be calculated
    document.body.style.setProperty('--pageTitleHeight', `${titleSize.height}px`);
    document.body.style.setProperty('--backButtonHeight', `${backButtonSize.height}px`);
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