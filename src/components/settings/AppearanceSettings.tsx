
import { useState, useEffect } from "react";
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
import { PaletteIcon, Paintbrush, Sun, Moon, Sidebar } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AppearanceSettingsProps {
  primaryColor: string;
  setPrimaryColor: (value: string) => void;
  accentColor: string;
  setAccentColor: (value: string) => void;
  secondaryColor: string;
  setSecondaryColor: (value: string) => void;
  sidebarColor: string;
  setSidebarColor: (value: string) => void;
  borderRadius: string;
  setBorderRadius: (value: string) => void;
  fontFamily: string;
  setFontFamily: (value: string) => void;
  darkMode: boolean;
  toggleDarkMode?: (value: boolean) => void;
}

const AppearanceSettings = ({
  primaryColor,
  setPrimaryColor,
  accentColor,
  setAccentColor,
  secondaryColor,
  setSecondaryColor,
  sidebarColor,
  setSidebarColor,
  borderRadius,
  setBorderRadius,
  fontFamily,
  setFontFamily,
  darkMode,
  toggleDarkMode,
}: AppearanceSettingsProps) => {
  // Pour forcer le rendu après changement de couleurs
  const [previewKey, setPreviewKey] = useState(0);
  
  // Mettre à jour la prévisualisation lorsque les couleurs changent
  useEffect(() => {
    setPreviewKey(prev => prev + 1);
  }, [primaryColor, accentColor, secondaryColor, sidebarColor, borderRadius, fontFamily, darkMode]);

  const handleThemeChange = (value: string) => {
    if (toggleDarkMode) {
      toggleDarkMode(value === "dark");
    }
  };

  // Tableau des polices disponibles pour la démo
  const fontFamilies = [
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Poppins", label: "Poppins" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Nunito", label: "Nunito" }
  ];

  // Style pour prévisualiser les polices dans le sélecteur
  const getFontStyle = (fontName: string) => {
    switch(fontName) {
      case "Roboto": return "font-roboto";
      case "Poppins": return "font-poppins";
      case "Open Sans": return "font-open-sans";
      case "Montserrat": return "font-montserrat";
      case "Nunito": return "font-nunito";
      default: return "font-sans";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PaletteIcon className="h-5 w-5 text-primary" />
            Thème et couleurs
          </CardTitle>
          <CardDescription>
            Personnalisez les couleurs principales de votre application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme-mode" className="font-medium mb-2 block">Mode d'affichage</Label>
                <RadioGroup
                  id="theme-mode" 
                  value={darkMode ? "dark" : "light"}
                  onValueChange={handleThemeChange}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light-mode" />
                    <Label htmlFor="light-mode" className="flex items-center gap-1.5">
                      <Sun className="h-4 w-4" /> Clair
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark-mode" />
                    <Label htmlFor="dark-mode" className="flex items-center gap-1.5">
                      <Moon className="h-4 w-4" /> Sombre
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
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
                <Label htmlFor="sidebar-color" className="flex items-center gap-1.5">
                  <Sidebar className="h-4 w-4" /> Couleur barre latérale
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="sidebar-color"
                    type="color"
                    value={sidebarColor}
                    onChange={(e) => setSidebarColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={sidebarColor}
                    onChange={(e) => setSidebarColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="font-family">Police de caractères</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="Sélectionner une police" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem 
                        key={font.value} 
                        value={font.value} 
                        className={getFontStyle(font.value)}
                      >
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-primary" />
            Aperçu du thème
          </CardTitle>
          <CardDescription>
            Visualisez votre thème personnalisé en temps réel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" key={previewKey}>
            <div className={`border rounded-lg p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}
                 style={{ fontFamily: getFontStyle(fontFamily).replace('font-', '') }}>
              <h4 className="font-bold">Mode {darkMode ? "sombre" : "clair"}</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                <div 
                  className="h-8 w-16 rounded shadow-sm" 
                  style={{ 
                    backgroundColor: primaryColor,
                    borderRadius: `${borderRadius}rem`
                  }}
                  title="Couleur principale"
                ></div>
                <div 
                  className="h-8 w-16 rounded shadow-sm" 
                  style={{ 
                    backgroundColor: accentColor,
                    borderRadius: `${borderRadius}rem`
                  }}
                  title="Couleur d'accent"
                ></div>
                <div 
                  className="h-8 w-16 rounded shadow-sm" 
                  style={{ 
                    backgroundColor: secondaryColor,
                    borderRadius: `${borderRadius}rem`
                  }}
                  title="Couleur secondaire"
                ></div>
                <div 
                  className="h-8 w-16 rounded shadow-sm" 
                  style={{ 
                    backgroundColor: sidebarColor,
                    borderRadius: `${borderRadius}rem`
                  }}
                  title="Couleur barre latérale"
                ></div>
              </div>
              <div className="mt-3 space-y-2">
                <Button size="sm" className="mr-2">Bouton</Button>
                <Button size="sm" variant="outline" className="mr-2">Outline</Button>
                <Button size="sm" variant="secondary" className="mr-2">Secondary</Button>
              </div>
              <p className={`mt-3 text-sm`}>
                Texte avec police <strong>{fontFamily}</strong>
              </p>
            </div>
            
            <div 
              className="border overflow-hidden" 
              style={{ 
                borderRadius: `${borderRadius}rem`,
                fontFamily: getFontStyle(fontFamily).replace('font-', '')
              }}
            >
              <div className="p-4 flex justify-between items-center text-white" 
                   style={{ backgroundColor: sidebarColor }}>
                <h4 className="font-bold">Barre latérale</h4>
                <Button size="sm" variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-white/40">
                  Action
                </Button>
              </div>
              <div className={`p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
                <p className="text-sm">Exemple de texte avec la police <strong>{fontFamily}</strong></p>
                <div className="mt-2 rounded p-2 text-white" style={{ backgroundColor: secondaryColor, borderRadius: `${borderRadius}rem` }}>
                  Composant secondaire
                </div>
                <div className="mt-2 rounded p-2 text-white" style={{ backgroundColor: accentColor, borderRadius: `${borderRadius}rem` }}>
                  Élément d'accent
                </div>
                <div className="mt-2 rounded p-2 text-white" style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}rem` }}>
                  Élément principal
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground italic">
            Note: Cet aperçu est une simulation. L'apparence réelle peut varier légèrement selon les éléments de l'interface.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
