
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cloudinaryService } from "@/services/cloudinaryService";
import CloudinaryUpload from "@/components/shared/CloudinaryUpload";
import { toast } from "sonner";
import { X, Search, Upload, Image, ImagePlus, Folder, Filter } from "lucide-react";
import { motion } from "framer-motion";

const MediaLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("employees");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center gap-2">
          <Image className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Bibliothèque multimédia</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            className="w-10 p-0"
            onClick={() => setViewMode("grid")}
          >
            <div className="grid grid-cols-2 gap-1">
              <div className="h-2 w-2 rounded-sm bg-current"></div>
              <div className="h-2 w-2 rounded-sm bg-current"></div>
              <div className="h-2 w-2 rounded-sm bg-current"></div>
              <div className="h-2 w-2 rounded-sm bg-current"></div>
            </div>
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            className="w-10 p-0"
            onClick={() => setViewMode("list")}
          >
            <div className="flex flex-col gap-1 items-stretch w-full">
              <div className="h-1 w-full rounded-sm bg-current"></div>
              <div className="h-1 w-full rounded-sm bg-current"></div>
              <div className="h-1 w-full rounded-sm bg-current"></div>
            </div>
            <span className="sr-only">List view</span>
          </Button>
          <CloudinaryUpload 
            onUploadComplete={handleUploadComplete} 
            category={selectedCategory}
            buttonText="Télécharger"
            folder={selectedCategory}
            className="ml-2"
          />
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="employees" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <TabsList className="mb-4 sm:mb-0 w-full sm:w-auto">
                <TabsTrigger value="employees" className="flex items-center gap-1">
                  <ImagePlus className="h-4 w-4" />
                  <span>Employés</span>
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-1">
                  <Folder className="h-4 w-4" />
                  <span>Produits</span>
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-1">
                  <Folder className="h-4 w-4" />
                  <span>Catégories</span>
                </TabsTrigger>
                <TabsTrigger value="general" className="flex items-center gap-1">
                  <Folder className="h-4 w-4" />
                  <span>Général</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une image..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
            </div>

            <TabsContent value={selectedCategory} className="mt-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredImages.length > 0 ? (
                <div className={viewMode === "grid" 
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" 
                  : "flex flex-col space-y-2"
                }>
                  {filteredImages.map((url, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      {viewMode === "grid" ? (
                        <Card className="overflow-hidden group relative hover:shadow-md transition-all duration-200">
                          <CardContent className="p-0">
                            <div className="aspect-square">
                              <img src={url} alt={`Image ${index}`} className="h-full w-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-3 gap-2">
                              <div className="flex gap-1 w-full">
                                <Button 
                                  size="sm" 
                                  variant="secondary" 
                                  className="flex-1 backdrop-blur-sm bg-white/30 hover:bg-white/50"
                                  onClick={() => {
                                    navigator.clipboard.writeText(url);
                                    toast.success("URL copiée dans le presse-papier");
                                  }}
                                >
                                  Copier URL
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  className="backdrop-blur-sm bg-red-500/70"
                                  onClick={() => handleDeleteImage(url)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="flex items-center gap-3 p-2 hover:bg-accent rounded-md group">
                          <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                            <img src={url} alt={`Image ${index}`} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 truncate">
                            <p className="text-sm font-medium">{url.split('/').pop()}</p>
                            <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                navigator.clipboard.writeText(url);
                                toast.success("URL copiée dans le presse-papier");
                              }}
                            >
                              Copier URL
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteImage(url)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-muted/50 rounded-full p-4 mb-4">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Aucune image disponible</h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    Téléchargez votre première image pour commencer à construire votre bibliothèque.
                  </p>
                  <CloudinaryUpload 
                    onUploadComplete={handleUploadComplete} 
                    category={selectedCategory}
                    buttonText="Télécharger une image"
                    folder={selectedCategory}
                  />
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MediaLibrary;
