"use client";
import { createContext, useContext, useState, useRef } from 'react';

const GlobalContext = createContext();

export default function GlobalContextContainer(props) {
  // Routing
  const [prevRoute, setPrevRoute] = useState('/'); // Previous route for the back button

  // Cursor
  const cursorPos = useRef({x: 0, y: 0});
  const cursorState = useRef('default');
  const cursorTrail = useRef(true);

  const setCursorState = (state) => {
    cursorState.current = state;
  }

  const setCursorPos = (pos) => {
    cursorPos.current = pos;
  }

  return (
    <GlobalContext.Provider value={{
      cursorPos,
      setCursorPos,
      cursorState,
      setCursorState,
      cursorTrail,
      prevRoute,
      setPrevRoute
    }}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);