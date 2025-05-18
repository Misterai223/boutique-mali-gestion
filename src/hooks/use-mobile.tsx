
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768; // Correspond à la valeur md de Tailwind

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Ajouter un écouteur d'événement pour les changements de taille
    window.addEventListener("resize", checkMobile);
    
    // Nettoyage
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

// Hook pour avoir des breakpoints plus précis
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return 'xs';
      if (width < 768) return 'sm';
      if (width < 1024) return 'md';
      if (width < 1280) return 'lg';
      if (width < 1536) return 'xl';
      return '2xl';
    }
    return 'md'; // Valeur par défaut
  });
  
  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) return setBreakpoint('xs');
      if (width < 768) return setBreakpoint('sm');
      if (width < 1024) return setBreakpoint('md');
      if (width < 1280) return setBreakpoint('lg');
      if (width < 1536) return setBreakpoint('xl');
      return setBreakpoint('2xl');
    };
    
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  return breakpoint;
}

// Hook pour récupérer la taille de l'écran
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return windowSize;
}
