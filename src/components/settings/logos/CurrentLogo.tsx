
import { Building } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CurrentLogoProps {
  logoUrl: string | null;
  className?: string;
}

const CurrentLogo = ({ logoUrl, className }: CurrentLogoProps) => {
  const source = logoUrl || "";
  const isFromCloudinary = source.includes("cloudinary");
  const isBase64 = source.startsWith("data:image");

  return (
    <Card className={cn("overflow-hidden border-dashed", className)}>
      <CardContent className="p-4 flex flex-col items-center space-y-2">
        <p className="text-xs text-muted-foreground">
          {logoUrl ? "Logo actuel" : "Aucun logo défini"}
        </p>
        
        <Avatar className="h-16 w-16 rounded-md border shadow-sm">
          <AvatarImage src={logoUrl || undefined} alt="Logo actuel" className="object-contain" />
          <AvatarFallback className="bg-muted text-muted-foreground">
            <Building className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        
        {logoUrl && (
          <div className="text-xs text-muted-foreground text-center">
            {isFromCloudinary && <span className="text-emerald-500 font-medium">Cloudinary</span>}
            {isBase64 && <span className="text-amber-500 font-medium">Local</span>}
            {!isFromCloudinary && !isBase64 && <span className="text-gray-500 font-medium">Externe</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentLogo;
