
// Configuration client Cloudinary pour le frontend

// Valeurs par défaut pour Cloudinary
const DEFAULT_CLOUD_NAME = 'dqhdjnmrq';
const DEFAULT_API_KEY = '833693739153773';
const DEFAULT_UPLOAD_PRESET = 'testprojet';

// Vérifie si les clés Cloudinary sont configurées dans localStorage
export const isCloudinaryConfigured = (): boolean => {
  const cloudName = localStorage.getItem('CLOUDINARY_CLOUD_NAME') || DEFAULT_CLOUD_NAME;
  const apiKey = localStorage.getItem('CLOUDINARY_API_KEY') || DEFAULT_API_KEY;

  return !!(cloudName && apiKey);
};

// Obtient le nom du cloud Cloudinary
export const getCloudName = (): string => {
  return localStorage.getItem('CLOUDINARY_CLOUD_NAME') || DEFAULT_CLOUD_NAME;
};

// Obtient la clé API Cloudinary
export const getApiKey = (): string => {
  return localStorage.getItem('CLOUDINARY_API_KEY') || DEFAULT_API_KEY;
};

// Obtient le preset de téléchargement
export const getUploadPreset = (): string => {
  return localStorage.getItem('CLOUDINARY_UPLOAD_PRESET') || DEFAULT_UPLOAD_PRESET;
};

// Obtient l'URL de base pour les uploads
export const getUploadUrl = (): string => {
  const cloudName = getCloudName();
  return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
};

// Initialise la configuration Cloudinary
export const configureCloudinary = (cloudName: string, apiKey: string, apiSecret: string, uploadPreset?: string): void => {
  localStorage.setItem('CLOUDINARY_CLOUD_NAME', cloudName);
  localStorage.setItem('CLOUDINARY_API_KEY', apiKey);
  localStorage.setItem('CLOUDINARY_API_SECRET', apiSecret);
  
  if (uploadPreset) {
    localStorage.setItem('CLOUDINARY_UPLOAD_PRESET', uploadPreset);
  }
};
