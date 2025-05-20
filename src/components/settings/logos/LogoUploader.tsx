
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";
import ImageSelectorModal from "./ImageSelectorModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LogoUploaderProps {
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMediaLibrarySelect: (url: string) => void;
}

const LogoUploader = ({ 
  isUploading,
  onFileChange,
  onMediaLibrarySelect
}: LogoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);

  const handleOpenMediaSelector = () => {
    setIsMediaSelectorOpen(true);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="grid grid-cols-2 gap-3 w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                variant="outline"
                className="w-full flex items-center justify-center"
                size="icon"
              >
                <Upload className="h-5 w-5" />
                <span className="sr-only">Importer un fichier</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileChange}
                  accept="image/jpeg,image/png,image/gif,image/svg+xml"
                  className="hidden"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{isUploading ? "Téléchargement..." : "Importer un fichier"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleOpenMediaSelector}
                variant="outline"
                className="w-full flex items-center justify-center"
                size="icon"
              >
                <Image className="h-5 w-5" />
                <span className="sr-only">Choisir depuis la médiathèque</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Choisir depuis la médiathèque</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

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
