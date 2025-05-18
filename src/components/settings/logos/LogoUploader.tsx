
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";
import ImageSelectorModal from "./ImageSelectorModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CloudinaryUpload from "@/components/shared/CloudinaryUpload";

interface LogoUploaderProps {
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMediaLibrarySelect: (url: string) => void;
  onCloudinaryUploadComplete?: (url: string) => void;
}

const LogoUploader = ({ 
  isUploading,
  onFileChange,
  onMediaLibrarySelect,
  onCloudinaryUploadComplete
}: LogoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("cloudinary");

  const handleOpenMediaSelector = () => {
    setIsMediaSelectorOpen(true);
  };
  
  const handleLocalFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCloudinaryComplete = (url: string) => {
    if (onCloudinaryUploadComplete) {
      onCloudinaryUploadComplete(url);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <Tabs defaultValue="cloudinary" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="cloudinary">Cloudinary</TabsTrigger>
          <TabsTrigger value="gallery">Médiathèque</TabsTrigger>
        </TabsList>

        <TabsContent value="cloudinary" className="space-y-2">
          <CloudinaryUpload
            onUploadComplete={handleCloudinaryComplete}
            folder="logos"
            buttonText="Téléverser via Cloudinary"
            category="logos"
            className="w-full"
          />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-2">
          <Button
            onClick={handleOpenMediaSelector}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            type="button"
          >
            <Image className="h-5 w-5" />
            <span>Choisir depuis la médiathèque</span>
          </Button>
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground text-center mt-1">
        Formats acceptés: JPG, PNG, GIF, SVG
      </p>

      <ImageSelectorModal
        open={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelectImage={onMediaLibrarySelect}
      />
    </div>
  );
};

export default LogoUploader;
