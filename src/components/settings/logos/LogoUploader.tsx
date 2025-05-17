
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";
import CloudinaryUpload from "@/components/shared/CloudinaryUpload";
import ImageSelectorModal from "./ImageSelectorModal";

interface LogoUploaderProps {
  isUploading: boolean;
  useCloudinary: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCloudinaryUploadComplete: (url: string) => void;
  onMediaLibrarySelect: (url: string) => void;
}

const LogoUploader = ({ 
  isUploading,
  useCloudinary,
  onFileChange,
  onCloudinaryUploadComplete,
  onMediaLibrarySelect
}: LogoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);

  const handleOpenMediaSelector = () => {
    setIsMediaSelectorOpen(true);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
        {useCloudinary ? (
          <CloudinaryUpload
            onUploadComplete={onCloudinaryUploadComplete}
            folder="logos"
            buttonText="Télécharger un logo"
            category="logos"
            accept="image/jpeg,image/png,image/gif,image/svg+xml"
            className="w-full"
          />
        ) : (
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            variant="outline"
            className="w-full text-xs sm:text-sm truncate"
            size="sm"
          >
            <Upload className="mr-1 h-3 w-3" />
            {isUploading ? "Téléchargement..." : "Importer un fichier"}
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept="image/jpeg,image/png,image/gif,image/svg+xml"
              className="hidden"
            />
          </Button>
        )}

        <Button
          onClick={handleOpenMediaSelector}
          variant="outline"
          className="w-full text-xs sm:text-sm truncate"
          size="sm"
        >
          <Image className="mr-1 h-3 w-3" />
          Choisir depuis la médiathèque
        </Button>
      </div>

      <ImageSelectorModal
        open={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelectImage={onMediaLibrarySelect}
      />
    </div>
  );
};

export default LogoUploader;
