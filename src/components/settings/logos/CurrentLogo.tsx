
import { useState } from "react";
import { Building } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <div className="mt-3 w-full">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Logo actuel</h3>
      <Card className="p-3 bg-muted/30 flex items-center justify-center h-28 overflow-hidden">
        {!imageError ? (
          <img
            src={logoUrl}
            alt="Logo actuel"
            className="max-h-20 max-w-full object-contain"
            onError={handleImageError}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <Building className="h-6 w-6" />
            <span className="text-xs">Image non disponible</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CurrentLogo;
