
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cloudinaryService } from "@/services/cloudinaryService";
import CloudinaryUpload from "@/components/shared/CloudinaryUpload";
import { toast } from "sonner";
import { X, Search, Upload } from "lucide-react";

const MediaLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("employees");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadImages(selectedCategory);
  }, [selectedCategory]);

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
  };

  const handleDeleteImage = (url: string) => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cette image ?");
    if (confirmed) {
      cloudinaryService.removeFileUrl(selectedCategory, url);
      setImages(prev => prev.filter(img => img !== url));
      toast.success("Image supprimée avec succès");
    }
  };

  const filteredImages = images.filter(url => 
    url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Bibliothèque multimédia</h1>
        <CloudinaryUpload 
          onUploadComplete={handleUploadComplete} 
          category={selectedCategory}
          buttonText="Télécharger une image"
          folder={selectedCategory}
        />
      </div>

      <Tabs defaultValue="employees" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="mb-4">
          <TabsTrigger value="employees">Employés</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="general">Général</TabsTrigger>
        </TabsList>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une image..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        <TabsContent value={selectedCategory} className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredImages.map((url, index) => (
                <Card key={index} className="overflow-hidden group relative">
                  <CardContent className="p-0">
                    <div className="aspect-square">
                      <img src={url} alt={`Image ${index}`} className="h-full w-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-white text-black hover:bg-gray-200"
                        onClick={() => {
                          navigator.clipboard.writeText(url);
                          toast.success("URL copiée dans le presse-papier");
                        }}
                      >
                        Copier l'URL
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteImage(url)}
                      >
                        <X className="h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg p-8">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune image disponible</h3>
              <p className="text-muted-foreground text-center mb-4">
                Téléchargez votre première image pour commencer à construire votre bibliothèque.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaLibrary;
