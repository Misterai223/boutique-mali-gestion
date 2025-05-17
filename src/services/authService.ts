
// Main auth service that re-exports all authentication functionality
import { simpleLogin } from "./auth/simpleAuth";
import { getSession, getCurrentUser, subscribeToAuthChanges } from "./auth/sessionManager";
import { logout, updatePassword, resetPassword } from "./auth/accountManager";
import { login, loginWithErrorHandling } from "./auth/loginWithErrorHandling";

// Export all auth functions as a consolidated service
export const authService = {
  simpleLogin,
  login,
  loginWithErrorHandling,
  logout,
  getSession,
  getCurrentUser,
  subscribeToAuthChanges,
  updatePassword,
  resetPassword
};
