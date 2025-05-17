
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
    <div className="mt-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Logo actuel</h3>
      <Card className="p-4 bg-muted/30 flex items-center justify-center h-40 overflow-hidden">
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
      </Card>
    </div>
  );
};

export default CurrentLogo;
