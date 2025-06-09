<template>
    <div v-if="!isOnline" class="offline-indicator">
        <div class="offline-content">
            <div class="offline-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z"
                        fill="currentColor" />
                </svg>
            </div>
            <span class="offline-text">Sin conexión</span>
            <div v-if="pendingOperations > 0" class="pending-count">
                {{ pendingOperations }}
            </div>
        </div>
    </div>

    <!-- Indicador de sincronización cuando vuelve la conexión -->
    <div v-if="isOnline && isSyncing" class="sync-indicator">
        <div class="sync-content">
            <div class="sync-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
                        fill="currentColor" />
                </svg>
            </div>
            <span class="sync-text">Sincronizando...</span>
        </div>
    </div>
</template>

<script>
import pwaService from '../services/pwa'

export default {
    name: 'OfflineIndicator',
    data() {
        return {
            isOnline: true,
            pendingOperations: 0,
            isSyncing: false
        }
    },
    mounted() {
        // Inicializar estado desde pwaService
        this.updateConnectionStatus();
        this.updatePendingCount();

        // Configurar listeners para eventos PWA
        this.setupPWAListeners();
    },
    beforeUnmount() {
        // Limpiar listeners al destruir el componente
        this.cleanupListeners();
    },
    methods: {
        setupPWAListeners() {
            // Escuchar cambios de conectividad
            window.addEventListener('connectivity-change', this.handleConnectivityChange);

            // Escuchar sincronización completada
            window.addEventListener('sync-complete', this.handleSyncComplete);

            // Escuchar cuando inicia la sincronización
            window.addEventListener('sync-start', this.handleSyncStart);

            // Actualizar estado periódicamente
            this.statusInterval = setInterval(() => {
                this.updateConnectionStatus();
                this.updatePendingCount();
            }, 5000); // Cada 5 segundos
        },

        cleanupListeners() {
            window.removeEventListener('connectivity-change', this.handleConnectivityChange);
            window.removeEventListener('sync-complete', this.handleSyncComplete);
            window.removeEventListener('sync-start', this.handleSyncStart);

            if (this.statusInterval) {
                clearInterval(this.statusInterval);
            }
        },

        handleConnectivityChange(event) {
            this.isOnline = event.detail.isOnline;

            if (this.isOnline && this.pendingOperations > 0) {
                // Si vuelve la conexión y hay operaciones pendientes, iniciar sincronización
                this.isSyncing = true;
                pwaService.syncPendingOperations();
            }
        },

        handleSyncComplete() {
            this.isSyncing = false;
            this.updatePendingCount();

            // Mostrar notificación de sincronización completada
            this.showSyncNotification();
        },

        handleSyncStart() {
            this.isSyncing = true;
        },

        updateConnectionStatus() {
            this.isOnline = pwaService.isAppOnline();
        },

        updatePendingCount() {
            this.pendingOperations = pwaService.pendingOperations.length;
        },

        showSyncNotification() {
            // Crear notificación temporal de sincronización completada
            const notification = document.createElement('div');
            notification.className = 'sync-notification';
            notification.innerHTML = `
        <div class="sync-notification-content">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
          </svg>
          <span>Sincronización completada</span>
        </div>
      `;

            notification.style.cssText = `
        position: fixed;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: #28a745;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        animation: slideDown 0.3s ease-out;
        font-size: 0.875rem;
      `;

            document.body.appendChild(notification);

            // Remover después de 3 segundos
            setTimeout(() => {
                notification.style.animation = 'slideUp 0.3s ease-out';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        },

        // Método para forzar sincronización manual (opcional)
        forcSync() {
            if (this.isOnline && this.pendingOperations > 0) {
                this.isSyncing = true;
                pwaService.syncPendingOperations();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.offline-indicator {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #ee6c74; // rojo pastel suave
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideDown 0.3s ease-out;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: darken(#ee6c74, 10%);
        transform: translateX(-50%) scale(1.05);
    }
}

.sync-indicator {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #6cbbe8; // azul pastel celeste
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideDown 0.3s ease-out;
}

.offline-content,
.sync-content {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    font-weight: 500;
}

.offline-icon,
.sync-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        animation: pulse 2s infinite;
    }
}

.sync-icon svg {
    animation: spin 1s linear infinite;
}

.pending-count {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    padding: 2px 6px;
    font-size: 0.75rem;
    min-width: 20px;
    text-align: center;
    font-weight: bold;
    border: 1px solid rgba(255, 255, 255, 0.35);
}

/* Estilos para la notificación de sincronización */
:deep(.sync-notification) {
    .sync-notification-content {
        display: flex;
        align-items: center;
        gap: 6px;
    }
}

/* Animaciones */
@keyframes slideDown {
    from {
        transform: translateX(-50%) translateY(-100%);
        opacity: 0;
    }

    to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }

    to {
        transform: translateX(-50%) translateY(-100%);
        opacity: 0;
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Responsive */
@media (max-width: 480px) {

    .offline-indicator,
    .sync-indicator {
        left: 10px;
        right: 10px;
        transform: none;
        max-width: calc(100% - 20px);
    }

    .offline-content,
    .sync-content {
        font-size: 0.8rem;
    }

    .pending-count {
        font-size: 0.7rem;
        padding: 1px 4px;
    }
}

/* Accesibilidad: reducir animaciones si el usuario lo prefiere */
@media (prefers-reduced-motion: reduce) {

    .offline-indicator,
    .sync-indicator {
        animation: none;
    }

    .offline-icon svg,
    .sync-icon svg {
        animation: none;
    }

    .offline-indicator:hover {
        transform: translateX(-50%);
    }
}
</style>
