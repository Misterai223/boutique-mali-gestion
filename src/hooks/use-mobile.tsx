
import React from "react";

// Définition des breakpoints en concordance avec Tailwind
const BREAKPOINTS = {
  xs: 640,
  sm: 768,
  md: 1024,
  lg: 1280,
  xl: 1536
};

/**
 * Hook pour détecter si l'écran est de taille mobile
 */
export function useIsMobile() {
  // Utiliser React.useState pour éviter les problèmes d'importation
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    // Vérifier si window est défini (pour compatibilité SSR)
    if (typeof window === 'undefined') return;
    
    // Fonction pour vérifier la taille de l'écran
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.sm);
    };
    
    // Vérifier immédiatement
    checkMobile();
    
    // Ajouter un écouteur pour les changements de taille
    window.addEventListener("resize", checkMobile);
    
    // Nettoyage à la destruction du composant
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return isMobile;
}

/**
 * Hook pour obtenir le breakpoint actuel
 */
export function useBreakpoint() {
  // Valeur par défaut pour éviter les erreurs en SSR
  const [breakpoint, setBreakpoint] = React.useState('md');
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < BREAKPOINTS.xs) return setBreakpoint('xs');
      if (width < BREAKPOINTS.sm) return setBreakpoint('sm');
      if (width < BREAKPOINTS.md) return setBreakpoint('md');
      if (width < BREAKPOINTS.lg) return setBreakpoint('lg');
      if (width < BREAKPOINTS.xl) return setBreakpoint('xl');
      return setBreakpoint('2xl');
    };
    
    // Vérifier immédiatement
    checkBreakpoint();
    
    // Ajouter l'écouteur
    window.addEventListener("resize", checkBreakpoint);
    
    // Nettoyage
    return () => {
      window.removeEventListener("resize", checkBreakpoint);
    };
  }, []);

  return breakpoint;
}

/**
 * Hook pour obtenir les dimensions de la fenêtre
 */
export function useWindowSize() {
  // Valeurs par défaut pour éviter les erreurs en SSR
  const [windowSize, setWindowSize] = React.useState({
    width: 0,
    height: 0,
  });
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Mettre à jour immédiatement
    handleResize();
    
    // Ajouter l'écouteur
    window.addEventListener("resize", handleResize);
    
    // Nettoyage
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  return windowSize;
}
