
import * as React from "react"

const MOBILE_BREAKPOINT = 768 // Correspond à la valeur md de Tailwind

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Vérifier au chargement initial
    checkMobile()
    
    // Ajouter un écouteur d'événement pour les changements de taille
    window.addEventListener("resize", checkMobile)
    
    // Nettoyage
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return !!isMobile
}

// Hook pour avoir des breakpoints plus précis
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'xs'|'sm'|'md'|'lg'|'xl'|'2xl'>('md')
  
  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth
      if (width < 640) return setBreakpoint('xs')
      if (width < 768) return setBreakpoint('sm')
      if (width < 1024) return setBreakpoint('md')
      if (width < 1280) return setBreakpoint('lg')
      if (width < 1536) return setBreakpoint('xl')
      return setBreakpoint('2xl')
    }
    
    checkBreakpoint()
    window.addEventListener("resize", checkBreakpoint)
    return () => window.removeEventListener("resize", checkBreakpoint)
  }, [])

  return breakpoint
}
