
// Configuration client Cloudinary pour le frontend

// Vérifie si les clés Cloudinary sont configurées dans localStorage
export const isCloudinaryConfigured = (): boolean => {
  const cloudName = localStorage.getItem('CLOUDINARY_CLOUD_NAME');
  const apiKey = localStorage.getItem('CLOUDINARY_API_KEY');
  const apiSecret = localStorage.getItem('CLOUDINARY_API_SECRET');

  return !!(cloudName && apiKey && apiSecret);
};

// Obtient le nom du cloud Cloudinary
export const getCloudName = (): string => {
  return localStorage.getItem('CLOUDINARY_CLOUD_NAME') || '';
};

// Obtient la clé API Cloudinary
export const getApiKey = (): string => {
  return localStorage.getItem('CLOUDINARY_API_KEY') || '';
};

// Obtient l'URL de base pour les uploads
export const getUploadUrl = (): string => {
  const cloudName = getCloudName();
  return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
};

// Initialise la configuration Cloudinary
export const configureCloudinary = (cloudName: string, apiKey: string, apiSecret: string): void => {
  localStorage.setItem('CLOUDINARY_CLOUD_NAME', cloudName);
  localStorage.setItem('CLOUDINARY_API_KEY', apiKey);
  localStorage.setItem('CLOUDINARY_API_SECRET', apiSecret);
};
