
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LogoGallery from "@/components/settings/logos/LogoGallery";
import CurrentLogo from "@/components/settings/logos/CurrentLogo";
import LogoUploader from "@/components/settings/logos/LogoUploader";
import { useLogoManagement } from "@/hooks/useLogoManagement";

const LogoSettings = () => {
  const {
    logoUrls,
    isLoading,
    isUploading,
    currentLogo,
    handleFileChange,
    handleSelectLogo,
    handleDeleteLogo
  } = useLogoManagement();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo de la boutique</CardTitle>
        <CardDescription>
          Téléchargez et gérez le logo de votre boutique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <LogoUploader
            isUploading={isUploading}
            onFileChange={handleFileChange}
            onMediaLibrarySelect={handleSelectLogo}
          />
          
          <CurrentLogo logoUrl={currentLogo} />

          <LogoGallery
            logoUrls={logoUrls}
            currentLogo={currentLogo}
            onSelectLogo={handleSelectLogo}
            onDeleteLogo={handleDeleteLogo}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoSettings;
