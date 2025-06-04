import axios from "axios"
import pwaService from "./pwa"
import offlineStorage from "./offline-storage"

const API_URL = "/api"
axios.defaults.timeout = 10000

// Interceptor para manejar requests offline
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (!pwaService.isAppOnline() && error.code === "NETWORK_ERROR") {
            // Si estamos offline, intentar obtener datos del cache
            const request = error.config
            if (request.method === "get") {
                try {
                    const cachedData = await getCachedData(request.url)
                    if (cachedData) {
                        return {
                            data: cachedData,
                            status: 200,
                            statusText: "OK (Cached)",
                            headers: {},
                            config: request,
                            fromCache: true,
                        }
                    }
                } catch (cacheError) {
                    console.error("Error obteniendo datos del cache:", cacheError)
                }
            }
        }
        return Promise.reject(error)
    },
)

// Función para obtener datos cacheados
async function getCachedData(url) {
    if (url.includes("/events/")) {
        return await offlineStorage.getEvents()
    }
    return null
}

const api = {
    // Obtener todos los eventos
    getEvents: async () => {
        try {
            const response = await axios.get(`${API_URL}/events/`)

            // Guardar en cache para uso offline
            if (response.data && !response.fromCache) {
                await offlineStorage.saveEvents(
                    response.data.map((event) => ({
                        ...event,
                        start: new Date(event.start),
                        end: new Date(event.end),
                    })),
                )
            }

            return response.data
        } catch (error) {
            console.error("Error al obtener eventos:", error.message)

            // Si estamos offline, intentar obtener del storage local
            if (!pwaService.isAppOnline()) {
                try {
                    const cachedEvents = await offlineStorage.getEvents()
                    return cachedEvents
                } catch (cacheError) {
                    console.error("Error obteniendo eventos del cache:", cacheError)
                }
            }

            throw error
        }
    },

    // Obtener un evento específico
    getEvent: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/events/${id}`)
            return response.data
        } catch (error) {
            console.error(`Error al obtener el evento ${id}:`, error)

            // Intentar obtener del cache offline
            if (!pwaService.isAppOnline()) {
                const cachedEvents = await offlineStorage.getEvents()
                const event = cachedEvents.find((e) => e.id === Number.parseInt(id))
                if (event) return event
            }

            throw error
        }
    },

    // Crear un nuevo evento
    createEvent: async (eventData) => {
        try {
            if (!pwaService.isAppOnline()) {
                // Crear evento offline
                const tempId = `temp_${Date.now()}`
                const offlineEvent = {
                    ...eventData,
                    id: tempId,
                    isOffline: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                }

                // Guardar en storage local
                await offlineStorage.saveEvent(offlineEvent)

                // Agregar a operaciones pendientes
                pwaService.addPendingOperation({
                    type: "CREATE_EVENT",
                    data: eventData,
                    tempId: tempId,
                })

                return offlineEvent
            }

            const response = await axios.post(`${API_URL}/events/`, eventData)

            // Guardar en cache
            await offlineStorage.saveEvent({
                ...response.data,
                start: new Date(response.data.start),
                end: new Date(response.data.end),
            })

            return response.data
        } catch (error) {
            console.error("Error al crear evento:", error)
            throw error
        }
    },

    // Actualizar un evento existente
    updateEvent: async (id, eventData) => {
        try {
            if (!pwaService.isAppOnline()) {
                // Actualizar evento offline
                const updatedEvent = {
                    ...eventData,
                    id: id,
                    updated_at: new Date(),
                    isOffline: true,
                }

                await offlineStorage.saveEvent(updatedEvent)

                // Agregar a operaciones pendientes
                pwaService.addPendingOperation({
                    type: "UPDATE_EVENT",
                    eventId: id,
                    data: eventData,
                })

                return updatedEvent
            }

            const response = await axios.put(`${API_URL}/events/${id}`, eventData)

            // Actualizar cache
            await offlineStorage.saveEvent({
                ...response.data,
                start: new Date(response.data.start),
                end: new Date(response.data.end),
            })

            return response.data
        } catch (error) {
            console.error(`Error al actualizar el evento ${id}:`, error)
            throw error
        }
    },

    // Marcar/desmarcar evento como completado
    toggleEventComplete: async (id, completed) => {
        try {
            if (!pwaService.isAppOnline()) {
                // Actualizar estado offline
                const cachedEvents = await offlineStorage.getEvents()
                const event = cachedEvents.find((e) => e.id === id)

                if (event) {
                    event.completed = completed
                    event.updated_at = new Date()
                    event.isOffline = true
                    await offlineStorage.saveEvent(event)
                }

                // Agregar a operaciones pendientes
                pwaService.addPendingOperation({
                    type: "TOGGLE_COMPLETE",
                    eventId: id,
                    data: { completed },
                })

                return event
            }

            const response = await axios.patch(`${API_URL}/events/${id}/toggle-complete`, {
                completed: completed,
            })

            // Actualizar cache
            await offlineStorage.saveEvent({
                ...response.data,
                start: new Date(response.data.start),
                end: new Date(response.data.end),
            })

            return response.data
        } catch (error) {
            console.error(`Error al cambiar estado del evento ${id}:`, error)
            throw error
        }
    },

    // Eliminar un evento
    deleteEvent: async (id) => {
        try {
            if (!pwaService.isAppOnline()) {
                // Eliminar del cache local
                await offlineStorage.deleteEvent(id)

                // Agregar a operaciones pendientes
                pwaService.addPendingOperation({
                    type: "DELETE_EVENT",
                    eventId: id,
                })

                return true
            }

            await axios.delete(`${API_URL}/events/${id}`)

            // Eliminar del cache
            await offlineStorage.deleteEvent(id)

            return true
        } catch (error) {
            console.error(`Error al eliminar el evento ${id}:`, error)
            throw error
        }
    },
}

export default api
