"use client";
import { createContext, useContext, useState, useRef } from 'react';

const GlobalContext = createContext();

export default function GlobalContextContainer(props) {
  // Routing
  const [prevRoute, setPrevRoute] = useState('/'); // Previous route for the back button

  return (
    <GlobalContext.Provider value={{
      prevRoute,
      setPrevRoute
    }}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);