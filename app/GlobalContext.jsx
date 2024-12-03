"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from "next/navigation";
import { includesAny } from '@/utils/utils';
import * as Constants from '@/Constants';

const GlobalContext = createContext();

export default function GlobalContextContainer(props) {
  // Routing
  const router = useRouter();
  const pathname = usePathname();
  const [prevRoute, setPrevRoute] = useState('/'); // Previous route for the back button
  const [transition, setTransition] = useState(true); // Whether or not the transition is active

  const incompleteRoutes = ["/"]; // Pages on this list will wait to have the transition manually ended

  // If we navigate directly to a page that isn't on the incomplete routes list,
  // end the transition
  useEffect(() => {
    if( !includesAny(pathname, incompleteRoutes) ){
      setTransition(false);
    }
  }, []);

  const navigate = (route) => {
    setTransition(true);
    setTimeout(() => {
      setPrevRoute(pathname.startsWith('/projects') ? '/' : pathname);
      router.push(route, { scroll: false });
      document.getElementById('scroll-container').scrollTo(0, 0);

      if( !includesAny(route, incompleteRoutes) ){
        setTimeout(() => {
          setTransition(false);
        }, Constants.transitionDuration * 500);
      }
    }, Constants.transitionDuration * 500);
  }

  return (
    <GlobalContext.Provider value={{
      navigate,
      prevRoute,
      transition,
      setTransition
    }}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);