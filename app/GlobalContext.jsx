"use client";
import { createContext, useContext, useState } from 'react';
import { useRouter } from "next/navigation";

const GlobalContext = createContext();

export default function GlobalContextContainer(props) {
  const router = useRouter();
  const [transition, setTransition] = useState(false);

  // Navigate between pages with a transition
  const navigate = (destination, incomplete) => {
    document.activeElement.blur();
    setTransition(true);

    setTimeout(() => { // Redirect after 0.5s
      router.push(destination);

      // It's possible to only transition halfway, allowing another function to control the rest of the transition
      if( incomplete === undefined || incomplete === false ) {
        setTimeout(() => { // End the transition after an additional 0.5s
          setTransition(false);
        }, transitionDuration * 1000);
      }
    }, transitionDuration * 1000);
  }

  return (
    <GlobalContext.Provider value={{
      navigate,
      transition,
      setTransition
    }}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);