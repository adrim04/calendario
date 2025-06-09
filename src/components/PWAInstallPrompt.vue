<template>
    <div v-if="showInstallPrompt" class="install-prompt">
        <div class="install-content">
            <div class="install-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor" />
                </svg>
            </div>
            <div class="install-text">
                <h3>Instalar MyScheduler</h3>
                <p>Instala la app para acceso rápido y uso offline</p>
            </div>
            <div class="install-actions">
                <button class="btn btn-install" @click="installApp">
                    Instalar
                </button>
                <button class="btn btn-dismiss" @click="dismissPrompt">
                    Ahora no
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import pwaService from '../services/pwa'

export default {
    name: 'PWAInstallPrompt',
    data() {
        return {
            showInstallPrompt: false
        }
    },
    mounted() {
        // Mostrar prompt después de un tiempo si no está instalada
        setTimeout(() => {
            if (!pwaService.isAppInstalled() && pwaService.getInstallPrompt()) {
                this.showInstallPrompt = true;
            }
        }, 30000); // Mostrar después de 30 segundos

        // Escuchar evento de instalación disponible
        window.addEventListener('beforeinstallprompt', () => {
            if (!pwaService.isAppInstalled()) {
                this.showInstallPrompt = true;
            }
        });
    },
    methods: {
        async installApp() {
            const installed = await pwaService.installApp();
            if (installed) {
                this.showInstallPrompt = false;
            }
        },
        dismissPrompt() {
            this.showInstallPrompt = false;
            // No mostrar de nuevo por un tiempo
            localStorage.setItem('installPromptDismissed', Date.now().toString());
        }
    }
}
</script>
<style lang="scss" scoped>
.install-prompt {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    z-index: 1000;
    animation: slideUp 0.3s ease-out;

    @media (min-width: 768px) {
        left: auto;
        right: 20px;
        max-width: 400px;
    }
}

.install-content {
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 12px;
}

.install-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background: #a3e4c4; // verde pastel suave
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
}

.install-text {
    flex: 1;

    h3 {
        margin: 0 0 4px 0;
        font-size: 1rem;
        font-weight: 600;
        color: #2c3e50;
    }

    p {
        margin: 0;
        font-size: 0.875rem;
        color: #6c757d;
    }
}

.install-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;

        &.btn-install {
            background: #a3e4c4; // mismo verde pastel
            color: white;

            &:hover {
                background: darken(#a3e4c4, 10%);
            }
        }

        &.btn-dismiss {
            background: transparent;
            color: #6c757d;

            &:hover {
                background: #f1f3f5;
            }
        }
    }
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
