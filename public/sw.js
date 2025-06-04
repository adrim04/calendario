const CACHE_NAME = "myscheduler-v1.0.0"
const API_CACHE_NAME = "myscheduler-api-v1.0.0"

// Detectar si estamos en desarrollo
const isDevelopment = location.hostname === "localhost" || location.hostname === "127.0.0.1"

// Archivos estáticos para cachear (solo en producción)
const STATIC_CACHE_URLS = isDevelopment
  ? ["/", "/manifest.json"]
  : [
      "/",
      "/static/js/bundle.js",
      "/static/css/main.css",
      "/manifest.json",
      "/icons/icon-192x192.png",
      "/icons/icon-512x512.png",
    ]

// URLs de la API para cachear
const API_URLS = ["/api/events/"]

// Instalar Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Instalando...")

  if (isDevelopment) {
    // En desarrollo, solo cachear lo mínimo
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then((cache) => {
          console.log("Service Worker: Modo desarrollo - cache mínimo")
          return cache.addAll(["/"]).catch((error) => {
            console.warn("Service Worker: Error cacheando en desarrollo:", error)
            // No fallar la instalación en desarrollo
            return Promise.resolve()
          })
        })
        .then(() => {
          console.log("Service Worker: Instalación completada (desarrollo)")
          return self.skipWaiting()
        }),
    )
  } else {
    // En producción, cachear todos los archivos
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then((cache) => {
          console.log("Service Worker: Cacheando archivos estáticos")
          return cache.addAll(STATIC_CACHE_URLS)
        })
        .then(() => {
          console.log("Service Worker: Instalación completada")
          return self.skipWaiting()
        })
        .catch((error) => {
          console.error("Service Worker: Error durante la instalación", error)
        }),
    )
  }
})

// Activar Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activando...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log("Service Worker: Eliminando cache antiguo", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker: Activación completada")
        return self.clients.claim()
      }),
  )
})

// Interceptar requests
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // En desarrollo, ser más permisivo con el cache
  if (isDevelopment) {
    // Solo cachear API calls en desarrollo
    if (url.pathname.startsWith("/api/")) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response.status === 200 && request.method === "GET") {
              const responseClone = response.clone()
              caches.open(API_CACHE_NAME).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          })
          .catch(() => {
            if (request.method === "GET") {
              return caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                  return cachedResponse
                }
                return new Response(
                  JSON.stringify({
                    error: "Sin conexión",
                    offline: true,
                    data: [],
                  }),
                  {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                  },
                )
              })
            }
            return new Response(
              JSON.stringify({
                error: "Sin conexión - Operación pendiente",
                offline: true,
              }),
              {
                status: 503,
                headers: { "Content-Type": "application/json" },
              },
            )
          }),
      )
    }
    return // No interceptar otros requests en desarrollo
  }

  // Lógica de producción
  // Estrategia para archivos estáticos: Cache First
  if (
    request.destination === "document" ||
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image"
  ) {
    event.respondWith(
      caches
        .match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          return fetch(request).then((response) => {
            // Solo cachear respuestas exitosas
            if (response.status === 200) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          })
        })
        .catch(() => {
          // Fallback para páginas offline
          if (request.destination === "document") {
            return caches.match("/")
          }
        }),
    )
  }

  // Estrategia para API: Network First con fallback a cache
  else if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cachear respuestas exitosas de la API
          if (response.status === 200 && request.method === "GET") {
            const responseClone = response.clone()
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Fallback a cache si no hay conexión
          if (request.method === "GET") {
            return caches.match(request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              // Respuesta offline por defecto
              return new Response(
                JSON.stringify({
                  error: "Sin conexión",
                  offline: true,
                  data: [],
                }),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                },
              )
            })
          }

          // Para métodos POST/PUT/DELETE offline
          return new Response(
            JSON.stringify({
              error: "Sin conexión - Operación pendiente",
              offline: true,
            }),
            {
              status: 503,
              headers: { "Content-Type": "application/json" },
            },
          )
        }),
    )
  }
})

// Background Sync para sincronizar datos cuando vuelva la conexión
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync", event.tag)

  if (event.tag === "sync-events") {
    event.waitUntil(syncPendingEvents())
  }
})

// Función para sincronizar eventos pendientes
async function syncPendingEvents() {
  try {
    // Obtener eventos pendientes del IndexedDB
    const pendingEvents = await getPendingEvents()

    for (const event of pendingEvents) {
      try {
        if (event.action === "create") {
          await fetch("/api/events/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event.data),
          })
        } else if (event.action === "update") {
          await fetch(`/api/events/${event.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event.data),
          })
        } else if (event.action === "delete") {
          await fetch(`/api/events/${event.id}`, {
            method: "DELETE",
          })
        }

        // Eliminar evento de la cola de pendientes
        await removePendingEvent(event.tempId)
      } catch (error) {
        console.error("Error sincronizando evento:", error)
      }
    }

    // Notificar a los clientes que la sincronización terminó
    const clients = await self.clients.matchAll()
    clients.forEach((client) => {
      client.postMessage({ type: "SYNC_COMPLETE" })
    })
  } catch (error) {
    console.error("Error en background sync:", error)
  }
}

// Funciones auxiliares para IndexedDB (simplificadas)
async function getPendingEvents() {
  // Implementación simplificada - en una app real usarías IndexedDB
  return []
}

async function removePendingEvent(tempId) {
  // Implementación simplificada
  console.log("Removiendo evento pendiente:", tempId)
}

// Push notifications (opcional)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()

    const options = {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      vibrate: [200, 100, 200],
      data: data.data,
      actions: [
        {
          action: "view",
          title: "Ver evento",
        },
        {
          action: "dismiss",
          title: "Descartar",
        },
      ],
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

// Manejar clicks en notificaciones
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "view") {
    event.waitUntil(clients.openWindow("/"))
  }
})
