/**
 * Service Worker para KQA - Gerador de Dados para QA
 * Implementa estratégias de cache para melhorar performance
 */

const CACHE_NAME = 'kqa-v1.0.0';
const DYNAMIC_CACHE = 'kqa-dynamic-v1.0.0';

// Recursos essenciais para cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
];

// Recursos que podem ser cachados dinamicamente
const CACHEABLE_ROUTES = [
  /^\/assets\/.*\.(js|css|png|jpg|jpeg|svg|woff2?)$/,
  /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
];

/**
 * Event listener para instalação do Service Worker
 */
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching essential assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation successful');
        return self.skipWaiting(); // Força ativação imediata
      })
      .catch(error => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

/**
 * Event listener para ativação do Service Worker
 */
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...');

  event.waitUntil(
    Promise.all([
      // Limpa caches antigos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Toma controle de todas as abas
      self.clients.claim(),
    ])
      .then(() => {
        console.log('[SW] Activation successful');
      })
      .catch(error => {
        console.error('[SW] Activation failed:', error);
      })
  );
});

/**
 * Event listener para interceptação de requests (fetch)
 */
self.addEventListener('fetch', event => {
  // Ignora requests que não são GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignora requests para extensões do Chrome
  if (event.request.url.includes('chrome-extension://')) {
    return;
  }

  event.respondWith(handleFetchRequest(event.request));
});

/**
 * Manipula requests de fetch com estratégias de cache
 * @param {Request} request - Request object
 * @returns {Promise<Response>} Response object
 */
async function handleFetchRequest(request) {
  const url = new URL(request.url);

  try {
    // Estratégia Cache First para recursos estáticos
    if (isCacheableAsset(url)) {
      return await cacheFirst(request);
    }

    // Estratégia Network First para HTML e APIs
    if (isNetworkFirst(url)) {
      return await networkFirst(request);
    }

    // Estratégia Stale While Revalidate para outros recursos
    return await staleWhileRevalidate(request);
  } catch (error) {
    console.error('[SW] Fetch error:', error);
    return await handleFetchError(request, error);
  }
}

/**
 * Verifica se o recurso deve ser cacheado estaticamente
 * @param {URL} url - URL object
 * @returns {boolean} True se deve ser cacheado
 */
function isCacheableAsset(url) {
  return (
    CACHEABLE_ROUTES.some(pattern => pattern.test(url.pathname)) ||
    url.origin.includes('fonts.googleapis.com') ||
    url.origin.includes('fonts.gstatic.com')
  );
}

/**
 * Verifica se deve usar estratégia Network First
 * @param {URL} url - URL object
 * @returns {boolean} True se deve usar Network First
 */
function isNetworkFirst(url) {
  return (
    url.pathname.endsWith('.html') ||
    url.pathname === '/' ||
    url.searchParams.has('no-cache')
  );
}

/**
 * Estratégia Cache First - busca no cache primeiro
 * @param {Request} request - Request object
 * @returns {Promise<Response>} Response object
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Se encontrado no cache, retorna e atualiza em background
    updateCacheInBackground(request);
    return cachedResponse;
  }

  // Se não encontrado no cache, busca na rede
  const networkResponse = await fetch(request);

  if (networkResponse.ok) {
    await addToCache(DYNAMIC_CACHE, request, networkResponse.clone());
  }

  return networkResponse;
}

/**
 * Estratégia Network First - busca na rede primeiro
 * @param {Request} request - Request object
 * @returns {Promise<Response>} Response object
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      await addToCache(DYNAMIC_CACHE, request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Se falha na rede, tenta buscar no cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

/**
 * Estratégia Stale While Revalidate
 * @param {Request} request - Request object
 * @returns {Promise<Response>} Response object
 */
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);

  // Sempre tenta buscar nova versão em background
  const networkPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        addToCache(DYNAMIC_CACHE, request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(error => {
      console.warn('[SW] Network fetch failed:', error);
    });

  // Retorna cache se disponível, senão espera pela rede
  return cachedResponse || networkPromise;
}

/**
 * Atualiza cache em background
 * @param {Request} request - Request object
 */
function updateCacheInBackground(request) {
  fetch(request)
    .then(response => {
      if (response.ok) {
        addToCache(DYNAMIC_CACHE, request, response);
      }
    })
    .catch(error => {
      console.warn('[SW] Background update failed:', error);
    });
}

/**
 * Adiciona recurso ao cache
 * @param {string} cacheName - Nome do cache
 * @param {Request} request - Request object
 * @param {Response} response - Response object
 */
async function addToCache(cacheName, request, response) {
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
  } catch (error) {
    console.warn('[SW] Failed to add to cache:', error);
  }
}

/**
 * Manipula erros de fetch
 * @param {Request} request - Request object
 * @param {Error} error - Error object
 * @returns {Promise<Response>} Response object
 */
async function handleFetchError(request, error) {
  // Tenta buscar no cache como fallback
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  // Se é uma navegação e não há cache, retorna página offline
  if (request.mode === 'navigate') {
    return new Response(
      `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KQA - Offline</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: #1a1a1a; 
            color: #fff; 
          }
          .offline-container { 
            max-width: 500px; 
            margin: 0 auto; 
          }
          .offline-icon { 
            font-size: 4em; 
            margin-bottom: 20px; 
          }
          button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <div class="offline-icon">📱</div>
          <h1>KQA - Modo Offline</h1>
          <p>Você está sem conexão com a internet. Alguns recursos podem estar limitados.</p>
          <button onclick="window.location.reload()">Tentar Novamente</button>
        </div>
      </body>
      </html>
    `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  // Para outros tipos de request, retorna erro
  return new Response('Network error', {
    status: 503,
    statusText: 'Service Unavailable',
  });
}

/**
 * Event listener para mensagens do cliente
 */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.addAll(event.data.urls || []);
      })
    );
  }
});

/**
 * Limpa caches antigos periodicamente
 */
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupOldCaches());
  }
});

/**
 * Limpa caches antigos
 */
async function cleanupOldCaches() {
  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(
      name => !name.includes(CACHE_NAME) && !name.includes(DYNAMIC_CACHE)
    );

    await Promise.all(oldCaches.map(cacheName => caches.delete(cacheName)));

    console.log('[SW] Cleaned up old caches:', oldCaches);
  } catch (error) {
    console.error('[SW] Cache cleanup failed:', error);
  }
}
