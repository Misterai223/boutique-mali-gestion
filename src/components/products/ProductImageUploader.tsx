
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Image } from "lucide-react";
import ImageSelector from "@/components/shared/ImageSelector";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CloudinaryUpload from "@/components/shared/CloudinaryUpload";

interface ProductImageUploaderProps {
  initialImageUrl?: string;
  onImageChange: (url: string) => void;
}

const ProductImageUploader = ({
  initialImageUrl = "",
  onImageChange
}: ProductImageUploaderProps) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);

  const handleUploadComplete = (url: string) => {
    setImageUrl(url);
    onImageChange(url);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    onImageChange("");
  };

  const handleSelectFromMedia = (url: string) => {
    setImageUrl(url);
    onImageChange(url);
  };

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Aperçu du produit"
            className="w-full h-48 object-contain border rounded-md"
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
          
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Télécharger
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Médiathèque
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <CloudinaryUpload 
                onUploadComplete={handleUploadComplete} 
                folder="products"
                buttonText="Choisir un fichier"
                category="products"
              />
              <div className="mt-2">
                <Button 
                  onClick={() => setIsMediaSelectorOpen(true)} 
                  variant="outline"
                  className="w-full"
                >
                  <Image className="mr-2 h-4 w-4" />
                  Sélectionner depuis la médiathèque
                </Button>
              </div>
            </div>
          </Tabs>
        </div>
      )}

      {imageUrl && (
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <CloudinaryUpload
            onUploadComplete={handleUploadComplete}
            folder="products"
            buttonText="Remplacer l'image"
            category="products"
            className="flex-1"
          />
          <Button 
            onClick={() => setIsMediaSelectorOpen(true)} 
            variant="outline"
            className="flex-1"
          >
            <Image className="mr-2 h-4 w-4" />
            Choisir depuis la médiathèque
          </Button>
        </div>
      )}

      {/* Image Selector Modal */}
      <ImageSelector
        open={isMediaSelectorOpen}
        onOpenChange={setIsMediaSelectorOpen}
        onSelect={handleSelectFromMedia}
        initialCategory="products"
      />
    </div>
  );
};

export default ProductImageUploader;
