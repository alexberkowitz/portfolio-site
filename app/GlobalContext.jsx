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
  const [transition, setTransition] = useState({
    active: true,
    x: 0,
    y: 0
  }); // Transition parameters

  const incompleteRoutes = ["/"]; // Pages on this list will wait to have the transition manually ended

  // If we navigate directly to a page that isn't on the incomplete routes list,
  // end the transition immediately
  useEffect(() => {
    if( !includesAny(pathname, incompleteRoutes) ){
      endTransition();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate to a new page with a transition
  const navigate = (e, route) => {
    setTransition({
      active: true,
      x: e.clientX || window.innerWidth / 2,
      y: e.clientY || window.innerHeight / 2
    });

    setTimeout(() => {
      setPrevRoute(pathname.startsWith('/projects') ? '/' : pathname);
      router.push(route, { scroll: false });
      document.getElementById('scroll-container').scrollTo(0, 0);

      if( !includesAny(route, incompleteRoutes) ){
        setTimeout(() => {
          endTransition();
        }, Constants.transitionDuration * 500);
      }
    }, Constants.transitionDuration * 500);
  }

  const endTransition = () => {
    setTransition({
      active: false,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
  }

  return (
    <GlobalContext.Provider value={{
      navigate,
      prevRoute,
      transition,
      setTransition,
      endTransition
    }}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);