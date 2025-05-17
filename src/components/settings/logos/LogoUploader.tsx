
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import CloudinaryUpload from "@/components/shared/CloudinaryUpload";

interface LogoUploaderProps {
  isUploading: boolean;
  useCloudinary: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCloudinaryUploadComplete: (url: string) => void;
}

const LogoUploader = ({ 
  isUploading,
  useCloudinary,
  onFileChange,
  onCloudinaryUploadComplete
}: LogoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-4">
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
            className="w-full sm:w-auto"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Téléchargement..." : "Télécharger un logo"}
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
    </div>
  );
};

export default LogoUploader;
