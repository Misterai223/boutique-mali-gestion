
import { z } from "zod";

// Schéma de validation pour la création d'utilisateur
export const createUserSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  full_name: z.string().min(2, "Le nom complet est requis"),
  role: z.string().min(1, "Le rôle est requis"),
  access_level: z.coerce.number().min(1).max(5)
});

// Schéma de validation pour la modification d'utilisateur
export const updateUserSchema = z.object({
  full_name: z.string().min(2, "Le nom complet est requis"),
  role: z.string().min(1, "Le rôle est requis"),
  access_level: z.coerce.number().min(1).max(5)
});

export type CreateUserForm = z.infer<typeof createUserSchema>;
export type UpdateUserForm = z.infer<typeof updateUserSchema>;
