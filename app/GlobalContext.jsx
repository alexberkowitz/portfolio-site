"use client";
import { createContext, useContext, useState, useRef } from 'react';
import { useRouter } from "next/navigation";

const GlobalContext = createContext();

export default function GlobalContextContainer(props) {
  const router = useRouter();
  const [transition, setTransition] = useState(false);
  const transitionPos = useRef({x: window.innerWidth/2, y: window.innerHeight/2});
  const transitionDuration = .3; // In seconds
  const [cursorState, setCursorState] = useState('default');

  // Navigate between pages with a transition
  const navigate = (e, destination, incomplete) => {
    document.activeElement.blur();
    const coords = {
      x: e.clientX,
      y: e.clientY
    }
    transitionPos.current = coords;
    setTransition(true);

    setTimeout(() => { // Redirect after 0.5s
      router.push(destination);
      transitionPos.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }

      // It's possible to only transition halfway, allowing another function to control the rest of the transition
      if( incomplete === undefined || incomplete === false ) {
        setTimeout(() => { // End the transition after an additional 0.5s
          setTransition(false);
        }, transitionDuration * 1000 + 500);
      }
    }, transitionDuration * 1000);
  }

  return (
    <GlobalContext.Provider value={{
      cursorState,
      setCursorState,
      navigate,
      transition,
      setTransition,
      transitionDuration,
      transitionPos
    }}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);