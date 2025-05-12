
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaletteIcon, Paintbrush } from "lucide-react";

interface AppearanceSettingsProps {
  primaryColor: string;
  setPrimaryColor: (value: string) => void;
  accentColor: string;
  setAccentColor: (value: string) => void;
  secondaryColor: string;
  setSecondaryColor: (value: string) => void;
  borderRadius: string;
  setBorderRadius: (value: string) => void;
  fontFamily: string;
  setFontFamily: (value: string) => void;
  darkMode: boolean;
}

const AppearanceSettings = ({
  primaryColor,
  setPrimaryColor,
  accentColor,
  setAccentColor,
  secondaryColor,
  setSecondaryColor,
  borderRadius,
  setBorderRadius,
  fontFamily,
  setFontFamily,
  darkMode,
}: AppearanceSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Apparence et thème</CardTitle>
        <CardDescription>
          Personnalisez l'apparence visuelle de votre application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="primary-color">Couleur principale</Label>
            <div className="flex space-x-2">
              <Input
                id="primary-color"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accent-color">Couleur d'accent</Label>
            <div className="flex space-x-2">
              <Input
                id="accent-color"
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondary-color">Couleur secondaire</Label>
            <div className="flex space-x-2">
              <Input
                id="secondary-color"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="border-radius">Arrondi des coins (rem)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="border-radius"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
                className="flex-1"
              />
              <span className="w-8 text-center">{borderRadius}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">Carré</span>
              <span className="text-xs text-muted-foreground">Arrondi</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="font-family">Police de caractères</Label>
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger id="font-family">
              <SelectValue placeholder="Sélectionner une police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Poppins">Poppins</SelectItem>
              <SelectItem value="Open Sans">Open Sans</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-4">
          <p className="text-sm font-medium mb-2">Aperçu du thème</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 bg-background">
              <h4 className="font-bold">Mode {darkMode ? "sombre" : "clair"}</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="h-8 w-16 rounded" style={{ backgroundColor: primaryColor }}></div>
                <div className="h-8 w-16 rounded" style={{ backgroundColor: accentColor }}></div>
                <div className="h-8 w-16 rounded" style={{ backgroundColor: secondaryColor }}></div>
              </div>
              <div className="mt-3 space-y-2">
                <Button size="sm" className="mr-2">Bouton</Button>
                <Button size="sm" variant="outline" className="mr-2">Outline</Button>
                <Button size="sm" variant="secondary" className="mr-2">Secondary</Button>
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-primary"></div>
                <div className="h-4 w-4 rounded-full bg-accent"></div>
                <div className="h-4 w-4 rounded-full bg-secondary"></div>
                <div className="h-4 w-4 rounded-full bg-muted"></div>
              </div>
            </div>
            <div className="rounded-lg border overflow-hidden" 
              style={{ 
                borderRadius: `${borderRadius}rem`,
                fontFamily: fontFamily === "Inter" ? "'Inter', sans-serif" : 
                          fontFamily === "Roboto" ? "'Roboto', sans-serif" :
                          fontFamily === "Poppins" ? "'Poppins', sans-serif" : 
                          "'Open Sans', sans-serif"
              }}>
              <div className="p-4 flex justify-between items-center border-b" style={{ backgroundColor: primaryColor, color: "#fff" }}>
                <h4 className="font-bold">Exemple d'interface</h4>
                <Button size="sm" variant="outline" className="bg-white text-black hover:bg-white/90">Action</Button>
              </div>
              <div className="p-4 bg-card">
                <p className="text-sm">Exemple de texte avec la police <strong>{fontFamily}</strong></p>
                <div className="mt-2 rounded p-2" style={{ backgroundColor: secondaryColor, color: "#fff" }}>
                  Composant secondaire
                </div>
                <div className="mt-2 rounded p-2 text-white" style={{ backgroundColor: accentColor }}>
                  Élément d'accent
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
