// Servicio para almacenamiento offline usando IndexedDB
class OfflineStorage {
    constructor() {
        this.dbName = "MySchedulerDB"
        this.dbVersion = 1
        this.db = null
        this.init()
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion)

            request.onerror = () => {
                console.error("Error abriendo IndexedDB")
                reject(request.error)
            }

            request.onsuccess = () => {
                this.db = request.result
                resolve(this.db)
            }

            request.onupgradeneeded = (event) => {
                const db = event.target.result

                // Store para eventos
                if (!db.objectStoreNames.contains("events")) {
                    const eventsStore = db.createObjectStore("events", { keyPath: "id" })
                    eventsStore.createIndex("start", "start", { unique: false })
                    eventsStore.createIndex("completed", "completed", { unique: false })
                }

                // Store para operaciones pendientes
                if (!db.objectStoreNames.contains("pendingOperations")) {
                    const pendingStore = db.createObjectStore("pendingOperations", { keyPath: "id" })
                    pendingStore.createIndex("timestamp", "timestamp", { unique: false })
                }

                // Store para configuración
                if (!db.objectStoreNames.contains("settings")) {
                    db.createObjectStore("settings", { keyPath: "key" })
                }
            }
        })
    }

    // Guardar eventos en IndexedDB
    async saveEvents(events) {
        if (!this.db) await this.init()

        const transaction = this.db.transaction(["events"], "readwrite")
        const store = transaction.objectStore("events")

        // Limpiar eventos existentes
        await store.clear()

        // Guardar nuevos eventos
        for (const event of events) {
            await store.add({
                ...event,
                start: event.start.toISOString(),
                end: event.end.toISOString(),
                lastModified: new Date().toISOString(),
            })
        }

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve()
            transaction.onerror = () => reject(transaction.error)
        })
    }

    // Obtener eventos desde IndexedDB
    async getEvents() {
        if (!this.db) await this.init()

        const transaction = this.db.transaction(["events"], "readonly")
        const store = transaction.objectStore("events")
        const request = store.getAll()

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const events = request.result.map((event) => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end),
                }))
                resolve(events)
            }
            request.onerror = () => reject(request.error)
        })
    }

    // Guardar un evento individual
    async saveEvent(event) {
        if (!this.db) await this.init()

        const transaction = this.db.transaction(["events"], "readwrite")
        const store = transaction.objectStore("events")

        const eventToSave = {
            ...event,
            start: event.start.toISOString(),
            end: event.end.toISOString(),
            lastModified: new Date().toISOString(),
        }

        return new Promise((resolve, reject) => {
            const request = store.put(eventToSave)
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    }

    // Eliminar un evento
    async deleteEvent(eventId) {
        if (!this.db) await this.init()

        const transaction = this.db.transaction(["events"], "readwrite")
        const store = transaction.objectStore("events")

        return new Promise((resolve, reject) => {
            const request = store.delete(eventId)
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }

    // Guardar operación pendiente
    async savePendingOperation(operation) {
        if (!this.db) await this.init()

        const transaction = this.db.transaction(["pendingOperations"], "readwrite")
        const store = transaction.objectStore("pendingOperations")

        return new Promise((resolve, reject) => {
            const request = store.add(operation)
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    }

    // Obtener operaciones pendientes
    async getPendingOperations() {
        if (!this.db) await this.init()

        const transaction = this.db.transaction(["pendingOperations"], "readonly")
        const store = transaction.objectStore("pendingOperations")
        const request = store.getAll()

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    }

    // Eliminar operación pendiente
    async deletePendingOperation(operationId) {
        if (!this.db) await this.init()

        const transaction = this.db.transaction(["pendingOperations"], "readwrite")
        const store = transaction.objectStore("pendingOperations")

        return new Promise((resolve, reject) => {
            const request = store.delete(operationId)
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }

    // Guardar configuración
    async saveSetting(key, value) {
        if (!this.db) await this.init()

        const transaction = this.db.transaction(["settings"], "readwrite")
        const store = transaction.objectStore("settings")

        return new Promise((resolve, reject) => {
            const request = store.put({ key, value })
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }

    // Obtener configuración
    async getSetting(key) {
        if (!this.db) await this.init()

        const transaction = this.db.transaction(["settings"], "readonly")
        const store = transaction.objectStore("settings")
        const request = store.get(key)

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(request.result ? request.result.value : null)
            }
            request.onerror = () => reject(request.error)
        })
    }
}

export default new OfflineStorage()
