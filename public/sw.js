
const CACHE_NAME = 'shop-manager-v3';

// Ressources à mettre en cache lors de l'installation
const INITIAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(INITIAL_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation terminée, activation du skipWaiting');
        return self.skipWaiting();
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation en cours...');
  // Nettoyer les anciens caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Prise de contrôle des clients');
      return self.clients.claim();
    })
  );
});

// Interception des requêtes de récupération
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Le cache a une réponse pour cette requête
        if (response) {
          return response;
        }
        
        // Pas de correspondance dans le cache, récupérer depuis le réseau
        return fetch(event.request)
          .then((response) => {
            // Vérifier si on a une réponse valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Cloner la réponse car elle est consommée une fois
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // Si le réseau échoue, essayer de retourner la page offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Envoi de message au Service Worker
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message reçu', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Gérer les notifications d'installation
  if (event.data && event.data.type === 'SHOW_INSTALL_PROMPT') {
    // Afficher une notification plus discrète
    self.registration.showNotification('Shop Manager', {
      body: 'Installez l\'application pour une meilleure expérience',
      icon: '/icons/icon-192x192.png',
      actions: [
        { action: 'install', title: 'Installer' },
        { action: 'dismiss', title: 'Fermer' }
      ],
      silent: true,
      requireInteraction: false, // Ne pas nécessiter d'interaction
      tag: 'pwa-install', // Tag pour éviter les doublons
    });
  }
});

// Gérer les notifications push
self.addEventListener('push', (event) => {
  console.log('Push notification reçue', event);
  
  const title = 'Shop Manager';
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir',
      },
      {
        action: 'close',
        title: 'Fermer',
      },
    ],
    silent: false,
    requireInteraction: false // Ne pas bloquer l'interface
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Notification cliquée', event);
  
  event.notification.close();
  
  // Gérer l'action d'installation
  if (event.action === 'install') {
    console.log('Action d\'installation depuis la notification');
    // Envoyer un message à tous les clients
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'TRIGGER_INSTALL_PROMPT'
        });
      });
    });
  }
  
  // Ouvrir l'application seulement si l'action est "explore"
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
  
  // Si l'action est "close" ou non spécifiée, ne rien faire de plus
});

// Supprimer la notification d'installation automatique à l'activation
self.addEventListener('activate', (event) => {
  console.log('Service Worker: activation terminée');
});
