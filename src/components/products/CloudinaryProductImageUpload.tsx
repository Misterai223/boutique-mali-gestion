
import { useState } from "react";
import { cloudinaryService } from "@/services/cloudinaryService";
import CloudinaryUpload from "@/components/shared/CloudinaryUpload";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImageUploadProps {
  initialImageUrl?: string;
  onImageChange: (url: string) => void;
}

const CloudinaryProductImageUpload = ({
  initialImageUrl = "",
  onImageChange
}: ProductImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

  const handleUploadComplete = (url: string) => {
    setImageUrl(url);
    onImageChange(url);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    onImageChange("");
  };

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Aperçu du produit"
            className="w-full h-40 object-contain border rounded-md"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 flex flex-col items-center justify-center bg-muted/30">
          <p className="text-sm text-muted-foreground mb-4">Aucune image sélectionnée</p>
          <CloudinaryUpload
            onUploadComplete={handleUploadComplete}
            folder="products"
            buttonText="Ajouter une image"
            category="products"
          />
        </div>
      )}

      {imageUrl && (
        <CloudinaryUpload
          onUploadComplete={handleUploadComplete}
          folder="products"
          buttonText="Changer d'image"
          category="products"
          className="mt-2"
        />
      )}
    </div>
  );
};

export default CloudinaryProductImageUpload;
