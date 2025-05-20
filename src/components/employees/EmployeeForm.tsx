
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Employee } from "@/types/employee";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import ImageSelector from "../shared/ImageSelector";
import { User, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Employee;
  onSave: (employee: Employee) => void;
}

const roles = [
  { value: "admin", label: "Administrateur" },
  { value: "manager", label: "Gérant" },
  { value: "cashier", label: "Caissier" },
  { value: "salesperson", label: "Vendeur" },
];

const EmployeeForm = ({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EmployeeFormProps) => {
  const [formData, setFormData] = useState<Employee>(
    initialData || {
      id: Date.now().toString(),
      name: "",
      email: "",
      phone: "",
      role: "salesperson",
      photoUrl: "",
      isUser: false
    }
  );
  
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: Date.now().toString(),
        name: "",
        email: "",
        phone: "",
        role: "salesperson",
        photoUrl: "",
        isUser: false
      });
    }
  }, [initialData, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    });
  };
  
  const handleImageSelect = (url: string) => {
    setFormData({
      ...formData,
      photoUrl: url,
    });
  };
  
  const handleIsUserChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isUser: checked,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Si l'employé est aussi un utilisateur, l'email est obligatoire
    if (formData.isUser && !formData.email) {
      toast.error("L'email est obligatoire pour les employés qui sont aussi des utilisateurs");
      return;
    }
    
    onSave(formData);
    toast.success(
      isEditing
        ? `Employé "${formData.name}" mis à jour`
        : `Employé "${formData.name}" ajouté`
    );
    
    // Reset form if not editing
    if (!isEditing) {
      setFormData({
        id: Date.now().toString(),
        name: "",
        email: "",
        phone: "",
        role: "salesperson",
        photoUrl: "",
        isUser: false
      });
    }
    
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Modifier l'employé" : "Ajouter un employé"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Mettez à jour les informations de l'employé ci-dessous"
                  : "Remplissez les informations pour créer un nouvel employé"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Photo */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photo" className="text-right">
                  Photo
                </Label>
                <div className="col-span-3 flex flex-col items-center gap-2">
                  <div 
                    className="relative cursor-pointer w-24 h-24 rounded-full overflow-hidden border hover:border-primary"
                    onClick={() => setIsImageSelectorOpen(true)}
                  >
                    {formData.photoUrl ? (
                      <img 
                        src={formData.photoUrl} 
                        alt={formData.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <User className="h-12 w-12 text-secondary-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsImageSelectorOpen(true)}
                  >
                    Sélectionner une image
                  </Button>
                </div>
              </div>
              
              {/* Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom complet*
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              {/* Email */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email{formData.isUser ? '*' : ''}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="col-span-3"
                  required={formData.isUser}
                />
              </div>
              
              {/* Phone */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              
              {/* Role */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Rôle
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger id="role" className="col-span-3">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* isUser Switch */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isUser" className="text-right">
                  Est un utilisateur
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="isUser"
                    checked={formData.isUser}
                    onCheckedChange={handleIsUserChange}
                  />
                  <Label htmlFor="isUser" className="text-sm text-muted-foreground">
                    {formData.isUser 
                      ? "Cet employé aura un compte utilisateur dans le système" 
                      : "Cet employé n'aura pas de compte utilisateur dans le système"}
                  </Label>
                </div>
              </div>
              
              {/* Informations supplémentaires pour l'utilisateur */}
              {formData.isUser && !isEditing && (
                <div className="col-span-4 p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-2">
                    Information sur le compte utilisateur:
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Un compte utilisateur sera créé automatiquement pour cet employé. 
                    Vous pourrez configurer ses informations d'authentification plus tard 
                    dans la section "Utilisateurs".
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <ImageSelector 
        open={isImageSelectorOpen}
        onOpenChange={setIsImageSelectorOpen}
        onSelect={handleImageSelect}
        initialCategory="employees"
      />
    </>
  );
};

export default EmployeeForm;
