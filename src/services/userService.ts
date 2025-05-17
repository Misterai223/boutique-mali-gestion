
import { createUser, deleteUser, isUserAdmin, updateUser } from "./users/userAuthService";
import { getAllUsers, getCurrentUser, getCurrentUserProfile, getProfiles, updateProfile } from "./users/userProfileService";
import { getUserActivityLogs, logUserActivity } from "./users/userActivityService";

// Exporter toutes les fonctions dans un objet userService
export const userService = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  getProfiles,
  updateProfile,
  getCurrentUserProfile,
  isUserAdmin,
  logUserActivity,
  getUserActivityLogs
};
