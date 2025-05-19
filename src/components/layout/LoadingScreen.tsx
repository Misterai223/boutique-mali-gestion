
import React from "react";

// Le composant LoadingScreen ne prend pas de props "message", donc nous devons l'adapter
const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <div className="text-lg font-medium text-muted-foreground">Chargement...</div>
      </div>
    </div>
  );
};

export default LoadingScreen;
