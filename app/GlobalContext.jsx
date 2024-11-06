"use client";
import { createContext, useContext, useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import * as Constants from '@/Constants';

const GlobalContext = createContext();

export default function GlobalContextContainer(props) {
  const router = useRouter();
  const [prevRoute, setPrevRoute] = useState('/');
  const hover = useRef({active: false, x: 0, y: 0, w: 0, h: 0});
  const transition = useRef({active: false, x: 0, y: 0});
  const [cursorState, setCursorState] = useState('default');

  // Navigate between pages with a transition
  const navigate = (e, destination, incomplete) => {
    setPrevRoute(window.location.pathname);
    document.activeElement.blur();
    transition.current = {
      active: true,
      x: e.clientX,
      y: e.clientY
    };

    setTimeout(() => { // Redirect after 0.5s
      router.push(destination);
      hover.current = {
        ...hover.current,
        active: false
      };

      // It's possible to only transition halfway, allowing another function to control the rest of the transition
      if( incomplete !== true ) {
        setTimeout(() => { // End the transition after an additional 0.5s
          transition.current = {
            active: false,
            x: undefined,
            y: undefined
          };
        }, Constants.transitionDuration * 1000 + 500);
      }
    }, Constants.transitionDuration * 1000);
  }

  // Set the hover state
  const setHover = (e, active, target) => {
    const coords = e.target.getBoundingClientRect();
    hover.current = {
      active: active,
      x: coords.x,
      y: coords.y,
      w: coords.width,
      h: coords.height,
      target: target
    };
  }

  return (
    <GlobalContext.Provider value={{
      cursorState,
      setCursorState,
      hover,
      prevRoute,
      setHover,
      navigate,
      transition
    }}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);