"use client";
import { createContext, useContext, useState, useRef } from 'react';
import { useRouter, usePathname } from "next/navigation";
import * as Constants from '@/Constants';

const GlobalContext = createContext();

export default function GlobalContextContainer(props) {
  // Routing
  const router = useRouter();
  const pathname = usePathname();
  const [prevRoute, setPrevRoute] = useState('/');

  // Cursor
  const [cursorState, setCursorState] = useState('default');
  const [hover, setHover] = useState({active: false, x: 0, y: 0, w: 0, h: 0});

  // Transition
  const transition = useRef({active: false, x: 0, y: 0});

  // Navigate between pages with a transition
  const navigate = (e, destination, incomplete) => {
    setPrevRoute(pathname.startsWith('/projects') ? '/' : pathname);

    document.activeElement.blur();
    transition.current = {
      active: true,
      x: e.clientX,
      y: e.clientY
    };

    setTimeout(() => { // Redirect after 0.5s
      router.push(destination);
      setHoverState({target:document.body}, false);

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
  const setHoverState = (e, active) => {
    const coords = e.target.getBoundingClientRect();
    setHover({
      active: active,
      x: coords.x + (coords.width / 2),
      y: coords.y + (coords.height / 2),
      w: coords.width,
      h: coords.height
    });
  }

  return (
    <GlobalContext.Provider value={{
      cursorState,
      setCursorState,
      hover,
      setHoverState,
      prevRoute,
      navigate,
      transition
    }}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);