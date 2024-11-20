"use client";
import { createContext, useContext, useState } from 'react';
import { useRouter, usePathname } from "next/navigation";

const GlobalContext = createContext();

export default function GlobalContextContainer(props) {
  // Routing
  const router = useRouter();
  const pathname = usePathname();
  const [prevRoute, setPrevRoute] = useState('/'); // Previous route for the back button
  const [transition, setTransition] = useState(false); // Whether or not the transition is active

  const navigate = (route) => {
    setTransition(true);
    setTimeout(() => {
      setPrevRoute(pathname.startsWith('/projects') ? '/' : pathname);
      router.push(route);

      setTimeout(() => {
        setTransition(false);
      }, 500);
    }, 500);
  }

  return (
    <GlobalContext.Provider value={{
      navigate,
      prevRoute,
      transition
    }}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);