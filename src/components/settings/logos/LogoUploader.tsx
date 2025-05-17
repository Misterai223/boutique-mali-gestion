
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {useCloudinary ? (
          <CloudinaryUpload
            onUploadComplete={onCloudinaryUploadComplete}
            folder="logos"
            buttonText="Télécharger un logo"
            category="logos"
            accept="image/jpeg,image/png,image/gif,image/svg+xml"
          />
        ) : (
          <>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Téléchargement..." : "Importer un fichier"}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept="image/jpeg,image/png,image/gif,image/svg+xml"
              className="hidden"
            />
          </>
        )}

        <Button
          onClick={handleOpenMediaSelector}
          variant="outline"
          className="flex-1 sm:flex-none"
        >
          <Image className="mr-2 h-4 w-4" />
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
