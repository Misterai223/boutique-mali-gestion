
// Configuration du client Cloudinary
import { v2 as cloudinary } from 'cloudinary';

// Initialisation de la configuration Cloudinary
export const initCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || localStorage.getItem('CLOUDINARY_CLOUD_NAME') || '',
    api_key: process.env.CLOUDINARY_API_KEY || localStorage.getItem('CLOUDINARY_API_KEY') || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || localStorage.getItem('CLOUDINARY_API_SECRET') || '',
    secure: true
  });

  return cloudinary;
};

// Fonction pour vérifier si les clés Cloudinary sont configurées
export const isCloudinaryConfigured = (): boolean => {
  const cloudName = localStorage.getItem('CLOUDINARY_CLOUD_NAME');
  const apiKey = localStorage.getItem('CLOUDINARY_API_KEY');
  const apiSecret = localStorage.getItem('CLOUDINARY_API_SECRET');

  return !!(cloudName && apiKey && apiSecret);
};

// Client Cloudinary initialisé par défaut
export const cloudinaryClient = initCloudinary();
