
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import CloudinaryUpload from "./CloudinaryUpload";

interface ImageSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  initialCategory?: string;
}

const ImageSelector = ({
  open,
  onOpenChange,
  onSelect,
  initialCategory = "employees"
}: ImageSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (open) {
      loadImages(selectedCategory);
    }
  }, [open, selectedCategory]);
  
  const loadImages = (category: string) => {
    setIsLoading(true);
    // Récupérer les images depuis le stockage local par catégorie
    const storedUrls = localStorage.getItem(`cloudinary_${category}_files`);
    const urls = storedUrls ? JSON.parse(storedUrls) : [];
    setImages(urls);
    setIsLoading(false);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleUploadComplete = (url: string) => {
    setImages(prev => [url, ...prev]);
    // Sélectionner automatiquement l'image téléchargée
    handleSelect(url);
  };
  
  const handleSelect = (url: string) => {
    onSelect(url);
    onOpenChange(false);
    toast.success("Image sélectionnée");
  };
  
  const filteredImages = images.filter(url => 
    url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sélectionner une image</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={initialCategory} value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="mb-4">
            <TabsTrigger value="employees">Employés</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="general">Général</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher une image..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            
            <CloudinaryUpload 
              onUploadComplete={handleUploadComplete} 
              category={selectedCategory}
              buttonText="Télécharger"
              folder={selectedCategory}
            />
          </div>
          
          <TabsContent value={selectedCategory} className="mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredImages.map((url, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleSelect(url)} 
                    className="aspect-square cursor-pointer rounded-md overflow-hidden border hover:border-primary transition-all hover:scale-105"
                  >
                    <img src={url} alt={`Image ${index}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg p-8">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune image disponible</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Téléchargez votre première image pour commencer.
                </p>
                <CloudinaryUpload 
                  onUploadComplete={handleUploadComplete} 
                  category={selectedCategory}
                  buttonText="Télécharger une image"
                  folder={selectedCategory}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSelector;
