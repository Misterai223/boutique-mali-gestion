
import { useState } from "react";
import { Building } from "lucide-react";

interface CurrentLogoProps {
  logoUrl: string | null;
}

const CurrentLogo = ({ logoUrl }: CurrentLogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  if (!logoUrl) return null;
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Logo actuel</h3>
      <div className="border rounded-md p-4 bg-muted/30 flex items-center justify-center h-40">
        {!imageError ? (
          <img
            src={logoUrl}
            alt="Logo actuel"
            className="max-h-32 max-w-full object-contain"
            onError={handleImageError}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Building className="h-10 w-10" />
            <span className="text-sm">Image non disponible</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentLogo;
