
/**
 * Functions related to session management and user state
 * Simplified to avoid Supabase integration issues
 */

// Get current session
export async function getSession() {
  return null;
}

// Get current user
export async function getCurrentUser() {
  return null;
}

// Check if MFA is required for a user
export async function checkMfaFactors() {
  return { isMfaEnabled: false, factors: [] };
}

// Subscribe to auth changes
export function subscribeToAuthChanges(callback) {
  // Return a dummy unsubscribe function
  return { unsubscribe: () => {} };
}
