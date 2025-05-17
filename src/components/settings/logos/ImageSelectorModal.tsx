
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
}

const ImageSelectorModal = ({ open, onClose, onSelectImage }: ImageSelectorModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [open, selectedCategory]);

  const loadImages = () => {
    setIsLoading(true);
    try {
      // Get images from local storage based on category
      const storedUrls = localStorage.getItem(`cloudinary_${selectedCategory}_files`);
      let urls: string[] = [];
      
      if (storedUrls) {
        urls = JSON.parse(storedUrls);
      }
      
      // Also get images from the "logos" category to ensure all logos are available
      const logoUrls = localStorage.getItem(`cloudinary_logos_files`);
      if (logoUrls) {
        const parsedLogoUrls = JSON.parse(logoUrls);
        // Combine and deduplicate
        urls = [...new Set([...urls, ...parsedLogoUrls])];
      }
      
      setImages(urls);
    } catch (error) {
      console.error("Error loading images:", error);
      toast.error("Erreur lors du chargement des images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectImage = (url: string) => {
    onSelectImage(url);
    onClose();
    toast.success("Image sélectionnée");
  };

  const filteredImages = images.filter(url => 
    url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sélectionner une image depuis la médiathèque</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="mb-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="logos">Logos</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
          </TabsList>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une image..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
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
                    onClick={() => handleSelectImage(url)}
                    className="aspect-square border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-all hover:scale-105 group"
                  >
                    <div className="w-full h-full relative">
                      <img src={url} alt={`Image ${index}`} className="h-full w-full object-contain" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" variant="secondary">Sélectionner</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Aucune image disponible dans cette catégorie</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSelectorModal;
