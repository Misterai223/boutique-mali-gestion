
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Palette, Layers, Type, Shadow } from "lucide-react";
import type { InvoiceSettings, InvoiceTheme } from "@/types/invoice";

interface InvoiceThemeSettingsProps {
  settings: InvoiceSettings;
  onSettingChange: (key: keyof InvoiceSettings, value: any) => void;
  onThemeChange: (key: keyof InvoiceTheme, value: any) => void;
}

const InvoiceThemeSettings = ({ settings, onSettingChange, onThemeChange }: InvoiceThemeSettingsProps) => {
  return (
    <div className="space-y-6">
      {/* Style de template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Style de Template
          </CardTitle>
          <CardDescription>
            Choisissez le style général de votre facture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Style de template</Label>
            <Select
              value={settings.theme.templateStyle}
              onValueChange={(value: 'modern' | 'classic' | 'minimal' | 'premium') => onThemeChange('templateStyle', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Moderne</SelectItem>
                <SelectItem value="classic">Classique</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Style d'en-tête</Label>
            <Select
              value={settings.theme.headerStyle}
              onValueChange={(value: 'gradient' | 'solid' | 'minimal') => onThemeChange('headerStyle', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gradient">Dégradé</SelectItem>
                <SelectItem value="solid">Couleur unie</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Style des cartes</Label>
            <Select
              value={settings.theme.cardStyle}
              onValueChange={(value: 'rounded' | 'sharp' | 'elevated') => onThemeChange('cardStyle', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rounded">Arrondies</SelectItem>
                <SelectItem value="sharp">Angulaires</SelectItem>
                <SelectItem value="elevated">Surélevées</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Style du tableau</Label>
            <Select
              value={settings.theme.tableStyle}
              onValueChange={(value: 'striped' | 'bordered' | 'minimal' | 'modern') => onThemeChange('tableStyle', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="striped">Rayé</SelectItem>
                <SelectItem value="bordered">Avec bordures</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="modern">Moderne</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Couleurs avancées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Palette de Couleurs
          </CardTitle>
          <CardDescription>
            Personnalisez entièrement la palette de couleurs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-color">Couleur principale</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => onSettingChange('primaryColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => onSettingChange('primaryColor', e.target.value)}
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
                  onChange={(e) => onSettingChange('accentColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={settings.accentColor}
                  onChange={(e) => onSettingChange('accentColor', e.target.value)}
                  placeholder="#3498db"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary-color">Couleur secondaire</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={settings.secondaryColor || '#95a5a6'}
                  onChange={(e) => onSettingChange('secondaryColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={settings.secondaryColor || '#95a5a6'}
                  onChange={(e) => onSettingChange('secondaryColor', e.target.value)}
                  placeholder="#95a5a6"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="background-color">Couleur de fond</Label>
              <div className="flex gap-2">
                <Input
                  id="background-color"
                  type="color"
                  value={settings.backgroundColor || '#ffffff'}
                  onChange={(e) => onSettingChange('backgroundColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={settings.backgroundColor || '#ffffff'}
                  onChange={(e) => onSettingChange('backgroundColor', e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typographie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typographie
          </CardTitle>
          <CardDescription>
            Personnalisez les polices et la taille du texte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Famille de police</Label>
              <Select
                value={settings.fontFamily}
                onValueChange={(value: 'helvetica' | 'times' | 'courier') => onSettingChange('fontFamily', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="helvetica">Helvetica (moderne)</SelectItem>
                  <SelectItem value="times">Times (classique)</SelectItem>
                  <SelectItem value="courier">Courier (monospace)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Taille de police</Label>
              <Select
                value={settings.fontSize}
                onValueChange={(value: 'small' | 'medium' | 'large') => onSettingChange('fontSize', value)}
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
          </div>
        </CardContent>
      </Card>

      {/* Effets visuels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shadow className="h-4 w-4" />
            Effets Visuels
          </CardTitle>
          <CardDescription>
            Ajustez les ombres, bordures et espacement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Intensité des ombres</Label>
            <Select
              value={settings.theme.shadowIntensity}
              onValueChange={(value: 'none' | 'light' | 'medium' | 'strong') => onThemeChange('shadowIntensity', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune</SelectItem>
                <SelectItem value="light">Légère</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="strong">Forte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Rayon des bordures: {settings.theme.borderRadius}px</Label>
            <Slider
              value={[settings.theme.borderRadius]}
              onValueChange={(value) => onThemeChange('borderRadius', value[0])}
              max={20}
              min={0}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Espacement</Label>
            <Select
              value={settings.theme.spacing}
              onValueChange={(value: 'compact' | 'normal' | 'spacious') => onThemeChange('spacing', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="spacious">Spacieux</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Filigrane */}
      <Card>
        <CardHeader>
          <CardTitle>Filigrane</CardTitle>
          <CardDescription>
            Ajoutez un filigrane à vos factures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="watermark-enabled">Activer le filigrane</Label>
            <Switch
              id="watermark-enabled"
              checked={settings.watermark?.enabled || false}
              onCheckedChange={(checked) => onSettingChange('watermark', { 
                ...settings.watermark, 
                enabled: checked 
              })}
            />
          </div>

          {settings.watermark?.enabled && (
            <>
              <div>
                <Label htmlFor="watermark-text">Texte du filigrane</Label>
                <Input
                  id="watermark-text"
                  value={settings.watermark?.text || ''}
                  onChange={(e) => onSettingChange('watermark', {
                    ...settings.watermark,
                    text: e.target.value
                  })}
                  placeholder="CONFIDENTIEL"
                />
              </div>

              <div>
                <Label>Opacité: {Math.round((settings.watermark?.opacity || 0.1) * 100)}%</Label>
                <Slider
                  value={[settings.watermark?.opacity || 0.1]}
                  onValueChange={(value) => onSettingChange('watermark', {
                    ...settings.watermark,
                    opacity: value[0]
                  })}
                  max={0.5}
                  min={0.05}
                  step={0.05}
                  className="mt-2"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceThemeSettings;
