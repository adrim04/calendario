// Servicio para manejar funcionalidades PWA
class PWAService {
    constructor() {
        this.isOnline = navigator.onLine
        this.pendingOperations = []
        this.setupEventListeners()
        this.loadPendingOperations()
    }

    setupEventListeners() {
        // Detectar cambios en la conectividad
        window.addEventListener("online", () => {
            this.isOnline = true
            this.notifyConnectivityChange(true)
            // Sincronizar automáticamente cuando vuelva la conexión
            if (this.pendingOperations.length > 0) {
                this.syncPendingOperations()
            }
        })

        window.addEventListener("offline", () => {
            this.isOnline = false
            this.notifyConnectivityChange(false)
        })

        // Escuchar mensajes del Service Worker
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.addEventListener("message", (event) => {
                if (event.data.type === "SYNC_COMPLETE") {
                    this.notifySync()
                }
            })
        }
    }

    // Verificar si la app está online
    isAppOnline() {
        return this.isOnline
    }

    // Agregar operación pendiente para sincronizar
    addPendingOperation(operation) {
        const pendingOp = {
            id: Date.now() + Math.random(),
            timestamp: new Date(),
            ...operation,
        }

        this.pendingOperations.push(pendingOp)
        this.savePendingOperations()

        // Registrar background sync si está disponible
        if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then((registration) => {
                return registration.sync.register("sync-events")
            })
        }

        return pendingOp.id
    }

    // Sincronizar operaciones pendientes
    async syncPendingOperations() {
        if (!this.isOnline || this.pendingOperations.length === 0) {
            return
        }

        // Notificar que inició la sincronización
        this.notifySyncStart()

        const operations = [...this.pendingOperations]
        const successfulOperations = []

        for (const operation of operations) {
            try {
                await this.executeOperation(operation)
                successfulOperations.push(operation)
            } catch (error) {
                console.error("Error sincronizando operación:", error)
                // Mantener la operación en la cola si falló
            }
        }

        // Remover operaciones exitosas
        this.pendingOperations = this.pendingOperations.filter(
            (op) => !successfulOperations.some((successOp) => successOp.id === op.id),
        )

        this.savePendingOperations()

        // Notificar que terminó la sincronización
        this.notifySync()
    }

    // Ejecutar una operación
    async executeOperation(operation) {
        const { type, data, eventId } = operation

        switch (type) {
            case "CREATE_EVENT":
                return await fetch("/api/events/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })

            case "UPDATE_EVENT":
                return await fetch(`/api/events/${eventId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })

            case "DELETE_EVENT":
                return await fetch(`/api/events/${eventId}`, {
                    method: "DELETE",
                })

            case "TOGGLE_COMPLETE":
                return await fetch(`/api/events/${eventId}/toggle-complete`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ completed: data.completed }),
                })

            default:
                throw new Error(`Tipo de operación desconocido: ${type}`)
        }
    }

    // Guardar operaciones pendientes en localStorage
    savePendingOperations() {
        try {
            localStorage.setItem("pendingOperations", JSON.stringify(this.pendingOperations))
        } catch (error) {
            console.error("Error guardando operaciones pendientes:", error)
        }
    }

    // Cargar operaciones pendientes desde localStorage
    loadPendingOperations() {
        try {
            const saved = localStorage.getItem("pendingOperations")
            if (saved) {
                this.pendingOperations = JSON.parse(saved)
            }
        } catch (error) {
            console.error("Error cargando operaciones pendientes:", error)
            this.pendingOperations = []
        }
    }

    // Notificar cambios de conectividad
    notifyConnectivityChange(isOnline) {
        const event = new CustomEvent("connectivity-change", {
            detail: { isOnline },
        })
        window.dispatchEvent(event)
    }

    // Notificar que inició la sincronización
    notifySyncStart() {
        const event = new CustomEvent("sync-start")
        window.dispatchEvent(event)
    }

    // Notificar sincronización completada
    notifySync() {
        const event = new CustomEvent("sync-complete")
        window.dispatchEvent(event)
    }

    // Obtener información de instalación
    getInstallPrompt() {
        return window.deferredPrompt
    }

    // Instalar la PWA
    async installApp() {
        const deferredPrompt = this.getInstallPrompt()
        if (deferredPrompt) {
            deferredPrompt.prompt()
            const { outcome } = await deferredPrompt.userChoice
            window.deferredPrompt = null
            return outcome === "accepted"
        }
        return false
    }

    // Verificar si la app está instalada
    isAppInstalled() {
        return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true
    }

    // Obtener estadísticas PWA
    getStats() {
        return {
            isOnline: this.isOnline,
            pendingOperations: this.pendingOperations.length,
            isInstalled: this.isAppInstalled(),
            canInstall: !!this.getInstallPrompt(),
        }
    }

    // Limpiar operaciones pendientes (para testing)
    clearPendingOperations() {
        this.pendingOperations = []
        this.savePendingOperations()
    }
}

// Instancia singleton
const pwaService = new PWAService()

// Configurar prompt de instalación
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault()
    window.deferredPrompt = e
})

export default pwaService
