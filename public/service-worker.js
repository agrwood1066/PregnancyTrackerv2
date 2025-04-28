const CACHE_NAME = 'pregnancy-tracker-cache-v1';
const urlsToCache = [
  '/',
  '/shopping-list',
  '/appointments',
  '/baby-names',
  '/hospital-bag',
  '/static/styles/main.css',
  '/static/scripts/main.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] Fetch', event.request.url);
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip API requests
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          }
        );
      })
  );
});

// Background sync for offline changes
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-shopping-list') {
    console.log('[Service Worker] Background sync for shopping list');
    event.waitUntil(syncShoppingList());
  }
});

// Function to sync shopping list data
async function syncShoppingList() {
  try {
    // Get offline changes from IndexedDB
    const offlineChanges = await getOfflineChanges();
    
    if (offlineChanges.length === 0) {
      console.log('[Service Worker] No offline changes to sync');
      return;
    }
    
    console.log('[Service Worker] Syncing', offlineChanges.length, 'offline changes');
    
    // Process each change
    for (const change of offlineChanges) {
      try {
        // Make API request to sync the change
        await syncChange(change);
        
        // Remove the change from IndexedDB after successful sync
        await removeOfflineChange(change.id);
      } catch (error) {
        console.error('[Service Worker] Error syncing change:', error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Error in syncShoppingList:', error);
  }
}

// Helper functions for IndexedDB operations
async function getOfflineChanges() {
  // This would be implemented to retrieve changes from IndexedDB
  // For now, return an empty array
  return [];
}

async function syncChange(change) {
  // This would be implemented to sync a change with the server
  // For now, just log the change
  console.log('[Service Worker] Syncing change:', change);
}

async function removeOfflineChange(id) {
  // This would be implemented to remove a change from IndexedDB
  // For now, just log the ID
  console.log('[Service Worker] Removing offline change:', id);
} 