/*-------------------------------------------------------*/
/* PAGE BORDER
/*-------------------------------------------------------*/
/* Fancy SVG-based page border that animates
/* to hide/show the site title
/*-------------------------------------------------------*/

"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation';
import { roundCorners } from 'svg-round-corners';
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
    }, Constants.titleDuration * 1000);
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
    const titleSize = isMobile ? {
      width: props.showTitle ? titleBounds?.width : 0,
      height: titleBounds?.height
    } : {
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
    
    
    // Set the SVG viewbox
    setViewbox(`0 0 ${windowSize.width} ${windowSize.height}`);
    
    // Build the inner path
    let newSVGPath = "";
    
    // The intent is to allow for relative positioning, so now we can use the width & height to offset from the right and bottom edges
    let points = isMobile ? [
      [ // Starting in the middle of the bottom helps ensure the corners round properly
        shapeSize.width / 2,
        shapeSize.height + posOffset
      ],
      ...(props.showTitle ? [] : [[ // (Extra animation point)
        backButtonSize.width + backButtonSize.height + cornerRadius - posOffset,
        shapeSize.height + posOffset
      ]]),
      [ // Back button bottom right
        backButtonSize.width + backButtonSize.height - posOffset,
        shapeSize.height + posOffset
      ],
      [ // Back button top right left
        backButtonSize.width - posOffset,
        shapeSize.height - backButtonSize.height + posOffset
      ],
      [ // Back button top left
        0 - posOffset,
        shapeSize.height - backButtonSize.height + posOffset
      ],
      [ // Top left
        0 - posOffset,
        0 - posOffset
      ],
      [ // Top right
        shapeSize.width + posOffset,
        0 - posOffset
      ],
      ...(props.showTitle ? [] : [[ // (Extra animation point)
        shapeSize.width + posOffset,
        shapeSize.height - titleSize.height - titleSize.width - cornerRadius + posOffset
      ]]),
      [ // Title top right
        shapeSize.width + posOffset,
        shapeSize.height - titleSize.height - titleSize.width + posOffset
      ],
      [ // Title top left
        shapeSize.width - titleSize.width + posOffset,
        shapeSize.height - titleSize.height + posOffset
      ],
      [ // Title bottom left
        shapeSize.width - titleSize.width + posOffset,
        shapeSize.height + posOffset
      ]
    ] : [
      [ // Starting in the middle of the bottom helps ensure the corners round properly
        shapeSize.width / 2,
        shapeSize.height + posOffset
      ],
      ...(props.showTitle ? [] : [[ // (Extra animation point)
        backButtonSize.width + backButtonSize.height + cornerRadius - posOffset,
        shapeSize.height + posOffset
      ]]),
      [ // Back button bottom right
        backButtonSize.width + backButtonSize.height - posOffset,
        shapeSize.height + posOffset
      ],
      [ // Back button top right
        backButtonSize.width - posOffset,
        shapeSize.height - backButtonSize.height + posOffset
      ],
      [ // Back button top left
        0 - posOffset,
        shapeSize.height - backButtonSize.height + posOffset
      ],
      [ // Title bottom left
        0 - posOffset,
        titleSize.height - posOffset
      ],   
      [ // Title bottom right
        titleSize.width - posOffset,
        titleSize.height - posOffset
      ],
      [ // Title top right
        titleSize.width + titleSize.height - posOffset,
        0 - posOffset
      ],
      ...(props.showTitle ? [] : [[ // (Extra animation point)
        titleSize.width + titleSize.height + cornerRadius - posOffset,
        0 - posOffset
      ]]),
      [ // Top right
        shapeSize.width + posOffset,
        0 - posOffset
      ],
      [ // Bottom right
        shapeSize.width + posOffset,
        shapeSize.height + posOffset
      ]
    ];
    
    // Add each point to the path string
    for( let i = 0; i < points.length; i++ ) {
      const command = i == 0 ? 'M' : 'L';
      const newPoint = [ Math.round(points[i][0]), Math.round(points[i][1]) ];
      newSVGPath += `${command} ${newPoint[0] + padding.left},${newPoint[1] + padding.top} `;
      console.log(newPoint);
    }
    
    // Close the path using the first point
    newSVGPath += `Z ${points[0][0] + padding.left},${points[0][1] + padding.top} `;
    
    // Apply the rounded corners
    const roundedPath = roundCorners(newSVGPath, padding.top, false);
    
    // Add outer rectangle after rounding corners
    // We add 10px so the stroke color only appears in the cutout
    const outerRect = `M -10,-10 L ${windowSize.width + 10},-10 L ${windowSize.width + 10},${windowSize.height + 10} L -10,${windowSize.height + 10} L -10,-10`;
    
    setSvgPath(roundedPath.path + outerRect);

    // Set the associated CSS properties on the body so page padding can be calculated
    document.body.style.setProperty('--pageTitleNominalDim', `${isMobile ? titleSize.width : titleSize.height}px`);
    document.body.style.setProperty('--backButtonNominalDim', `${backButtonSize.height}px`);
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