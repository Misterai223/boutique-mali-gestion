
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { FileText, Building, Palette, Layout, Eye } from "lucide-react";
import { invoiceSettingsService } from "@/services/invoiceSettingsService";
import type { InvoiceSettings as InvoiceSettingsType } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";
import LogoUploader from "@/components/settings/logos/LogoUploader";
import { useLogoManagement } from "@/hooks/useLogoManagement";
import { AdvancedPdfGenerator } from "@/utils/advancedPdfGenerator";

const InvoiceSettings = () => {
  const [settings, setSettings] = useState<InvoiceSettingsType>(invoiceSettingsService.getSettings());
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  const { handleFileChange, isUploading } = useLogoManagement();

  const handleSettingChange = (key: keyof InvoiceSettingsType, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleCompanyInfoChange = (key: keyof InvoiceSettingsType['companyInfo'], value: string) => {
    setSettings(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    invoiceSettingsService.saveSettings(settings);
    setHasChanges(false);
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres de facture ont été mis à jour",
    });
  };

  const handlePreview = () => {
    try {
      const generator = new AdvancedPdfGenerator(settings);
      const sampleData = [
        {
          id: 1,
          description: "Vente de téléphones",
          amount: 250000,
          type: "income" as const,
          date: new Date().toISOString(),
          category: "Ventes"
        },
        {
          id: 2,
          description: "Paiement du loyer",
          amount: 100000,
          type: "expense" as const,
          date: new Date().toISOString(),
          category: "Loyer"
        }
      ];

      const doc = generator.generateInvoice(sampleData, "Aperçu de Facture");
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Error generating preview:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer l'aperçu",
        variant: "destructive"
      });
    }
  };

  const handleLogoSelect = (url: string) => {
    handleCompanyInfoChange('logo', url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Configuration des Factures PDF
        </CardTitle>
        <CardDescription>
          Personnalisez l'apparence et le contenu de vos factures PDF
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="company" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company">
              <Building className="h-4 w-4 mr-2" />
              Entreprise
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="h-4 w-4 mr-2" />
              Mise en page
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              Apparence
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="h-4 w-4 mr-2" />
              Contenu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Nom de l'entreprise</Label>
                  <Input
                    id="company-name"
                    value={settings.companyInfo.name}
                    onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company-phone">Téléphone</Label>
                  <Input
                    id="company-phone"
                    value={settings.companyInfo.phone}
                    onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company-email">Email</Label>
                  <Input
                    id="company-email"
                    type="email"
                    value={settings.companyInfo.email}
                    onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company-website">Site web</Label>
                  <Input
                    id="company-website"
                    value={settings.companyInfo.website || ''}
                    onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company-tax">Numéro fiscal</Label>
                  <Input
                    id="company-tax"
                    value={settings.companyInfo.taxNumber || ''}
                    onChange={(e) => handleCompanyInfoChange('taxNumber', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company-address">Adresse complète</Label>
                  <Textarea
                    id="company-address"
                    rows={4}
                    value={settings.companyInfo.address}
                    onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Logo de l'entreprise</Label>
                  <LogoUploader
                    isUploading={isUploading}
                    onFileChange={handleFileChange}
                    onMediaLibrarySelect={handleLogoSelect}
                  />
                  {settings.companyInfo.logo && (
                    <div className="mt-2">
                      <img
                        src={settings.companyInfo.logo}
                        alt="Logo"
                        className="h-16 w-16 object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Format de page</Label>
                <Select
                  value={settings.pageSize}
                  onValueChange={(value: 'A4' | 'Letter') => handleSettingChange('pageSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4</SelectItem>
                    <SelectItem value="Letter">Letter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Orientation</Label>
                <Select
                  value={settings.orientation}
                  onValueChange={(value: 'portrait' | 'landscape') => handleSettingChange('orientation', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Paysage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Position du logo</Label>
                <Select
                  value={settings.logoPosition}
                  onValueChange={(value: 'left' | 'center' | 'right') => handleSettingChange('logoPosition', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Gauche</SelectItem>
                    <SelectItem value="center">Centre</SelectItem>
                    <SelectItem value="right">Droite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Taille du logo</Label>
                <Select
                  value={settings.logoSize}
                  onValueChange={(value: 'small' | 'medium' | 'large') => handleSettingChange('logoSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Petit</SelectItem>
                    <SelectItem value="medium">Moyen</SelectItem>
                    <SelectItem value="large">Grand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary-color">Couleur principale</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    placeholder="#2980b9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="accent-color">Couleur d'accent</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent-color"
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings.accentColor}
                    onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                    placeholder="#3498db"
                  />
                </div>
              </div>
              <div>
                <Label>Taille de police</Label>
                <Select
                  value={settings.fontSize}
                  onValueChange={(value: 'small' | 'medium' | 'large') => handleSettingChange('fontSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Petite</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Format de date</Label>
                <Select
                  value={settings.dateFormat}
                  onValueChange={(value: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD') => handleSettingChange('dateFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-header">Inclure un en-tête</Label>
                <Switch
                  id="include-header"
                  checked={settings.includeHeader}
                  onCheckedChange={(checked) => handleSettingChange('includeHeader', checked)}
                />
              </div>
              {settings.includeHeader && (
                <div>
                  <Label htmlFor="header-text">Texte de l'en-tête</Label>
                  <Input
                    id="header-text"
                    value={settings.headerText || ''}
                    onChange={(e) => handleSettingChange('headerText', e.target.value)}
                    placeholder="Facture"
                  />
                </div>
              )}
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="include-footer">Inclure un pied de page</Label>
                <Switch
                  id="include-footer"
                  checked={settings.includeFooter}
                  onCheckedChange={(checked) => handleSettingChange('includeFooter', checked)}
                />
              </div>
              {settings.includeFooter && (
                <div>
                  <Label htmlFor="footer-text">Texte du pied de page</Label>
                  <Input
                    id="footer-text"
                    value={settings.footerText || ''}
                    onChange={(e) => handleSettingChange('footerText', e.target.value)}
                    placeholder="Merci pour votre confiance"
                  />
                </div>
              )}
              
              <Separator />
              
              <div>
                <Label htmlFor="currency">Devise</Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </Button>
          <div className="flex gap-2">
            {hasChanges && (
              <Button variant="outline" onClick={() => {
                setSettings(invoiceSettingsService.getSettings());
                setHasChanges(false);
              }}>
                Annuler
              </Button>
            )}
            <Button onClick={handleSave} disabled={!hasChanges}>
              Sauvegarder les paramètres
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceSettings;
