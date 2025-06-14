
// Configuration client Cloudinary pour le frontend

// Vos identifiants Cloudinary
const CLOUDINARY_CLOUD_NAME = 'dqhdjnmrq';
const CLOUDINARY_API_KEY = '833693739153773';
const CLOUDINARY_API_SECRET = '7spozpGI-CN333Qo8Zp_FMXWzg0';
const CLOUDINARY_UPLOAD_PRESET = 'testprojet';

// Vérifie si les clés Cloudinary sont configurées
export const isCloudinaryConfigured = (): boolean => {
  const cloudName = localStorage.getItem('CLOUDINARY_CLOUD_NAME') || CLOUDINARY_CLOUD_NAME;
  const apiKey = localStorage.getItem('CLOUDINARY_API_KEY') || CLOUDINARY_API_KEY;

  return !!(cloudName && apiKey);
};

// Obtient le nom du cloud Cloudinary
export const getCloudName = (): string => {
  return localStorage.getItem('CLOUDINARY_CLOUD_NAME') || CLOUDINARY_CLOUD_NAME;
};

// Obtient la clé API Cloudinary
export const getApiKey = (): string => {
  return localStorage.getItem('CLOUDINARY_API_KEY') || CLOUDINARY_API_KEY;
};

// Obtient le secret API Cloudinary
export const getApiSecret = (): string => {
  return localStorage.getItem('CLOUDINARY_API_SECRET') || CLOUDINARY_API_SECRET;
};

// Obtient le preset de téléchargement
export const getUploadPreset = (): string => {
  return localStorage.getItem('CLOUDINARY_UPLOAD_PRESET') || CLOUDINARY_UPLOAD_PRESET;
};

// Obtient l'URL de base pour les uploads
export const getUploadUrl = (): string => {
  const cloudName = getCloudName();
  return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
};

// Initialise la configuration Cloudinary avec vos identifiants
export const initializeCloudinaryConfig = (): void => {
  if (!localStorage.getItem('CLOUDINARY_CLOUD_NAME')) {
    localStorage.setItem('CLOUDINARY_CLOUD_NAME', CLOUDINARY_CLOUD_NAME);
  }
  if (!localStorage.getItem('CLOUDINARY_API_KEY')) {
    localStorage.setItem('CLOUDINARY_API_KEY', CLOUDINARY_API_KEY);
  }
  if (!localStorage.getItem('CLOUDINARY_API_SECRET')) {
    localStorage.setItem('CLOUDINARY_API_SECRET', CLOUDINARY_API_SECRET);
  }
  if (!localStorage.getItem('CLOUDINARY_UPLOAD_PRESET')) {
    localStorage.setItem('CLOUDINARY_UPLOAD_PRESET', CLOUDINARY_UPLOAD_PRESET);
  }
};

// Configure les identifiants Cloudinary
export const configureCloudinary = (cloudName: string, apiKey: string, apiSecret: string, uploadPreset?: string): void => {
  localStorage.setItem('CLOUDINARY_CLOUD_NAME', cloudName);
  localStorage.setItem('CLOUDINARY_API_KEY', apiKey);
  localStorage.setItem('CLOUDINARY_API_SECRET', apiSecret);
  
  if (uploadPreset) {
    localStorage.setItem('CLOUDINARY_UPLOAD_PRESET', uploadPreset);
  }
};

// Initialise automatiquement la configuration au chargement
initializeCloudinaryConfig();

console.log('=== CONFIGURATION CLOUDINARY ===');
console.log('Cloud Name:', getCloudName());
console.log('API Key:', getApiKey());
console.log('Upload Preset:', getUploadPreset());
console.log('Configuration active:', isCloudinaryConfigured());
