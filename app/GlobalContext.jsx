"use client";
import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from "next/navigation";
import * as Constants from '@/Constants';

const GlobalContext = createContext();

export default function GlobalContextContainer(props) {
  // Routing
  const [prevRoute, setPrevRoute] = useState('/'); // Previous route for the back button

  // Cursor
  const cursorPos = useRef({x: 0, y: 0});
  const [cursorState, setCursorState] = useState('default');
  const [hover, setHover] = useState({active: false, x: 0, y: 0, w: 0, h: 0});
  const cursorTrail = useRef(true);

  // Set the hover state
  const setHoverState = (e, active, isFixed) => {
    const coords = e.target.getBoundingClientRect();
    setHover({
      active: active,
      x: coords.x + (coords.width / 2),
      y: coords.y + (coords.height / 2),
      w: coords.width,
      h: coords.height,
      isFixed: isFixed === true
    });
  }

  return (
    <GlobalContext.Provider value={{
      cursorPos,
      cursorState,
      setCursorState,
      cursorTrail,
      hover,
      setHoverState,
      prevRoute,
      setPrevRoute
    }}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);