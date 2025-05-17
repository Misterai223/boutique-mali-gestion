
export interface Employee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  photoUrl?: string;
  isUser: boolean;  // Indique si cet employé est également un utilisateur du système
  userId?: string;  // Référence optionnelle à un utilisateur (si l'employé est aussi un utilisateur)
}
