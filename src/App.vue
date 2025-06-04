<template>
  <div class="app-container">
    <!-- Indicadores PWA -->
    <OfflineIndicator />
    <PWAInstallPrompt />

    <NavBar @create-event="handleCreateEvent" />
    <main class="main-content">
      <div class="calendar-container">
        <h1>Mi Calendario</h1>

        <!-- Loading con spinner mejorado -->
        <LoadingSpinner v-if="loading" size="large" message="Cargando eventos..." />

        <div v-if="error" class="error-message">
          <p>{{ error }}</p>
          <button @click="fetchEvents" class="btn btn-retry">Reintentar</button>
        </div>

        <Calendar v-if="!loading && !error" ref="calendar" :events="events" @event-selected="handleEventSelected"
          @date-selected="handleDateSelected" />
      </div>

      <EventForm v-if="showEventForm" :event="selectedEvent" @save="saveEvent" @cancel="cancelEvent"
        @delete="deleteEvent" @toggle-complete="toggleEventComplete" :loading="formLoading" />
    </main>
    <Footer />

    <!-- Loading overlay para operaciones -->
    <LoadingSpinner v-if="formLoading" overlay message="Guardando..." />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import Calendar from './components/Calendar.vue'
import EventForm from './components/EventForm.vue'
import OfflineIndicator from './components/OfflineIndicator.vue'
import PWAInstallPrompt from './components/PWAInstallPrompt.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import api from './services/api-offline'
import pwaService from './services/pwa'

export default {
  name: 'App',
  components: {
    NavBar,
    Footer,
    Calendar,
    EventForm,
    OfflineIndicator,
    PWAInstallPrompt,
    LoadingSpinner
  },
  data() {
    return {
      events: [],
      showEventForm: false,
      selectedEvent: null,
      loading: true,
      formLoading: false,
      error: null
    }
  },
  async created() {
    // Cargar operaciones pendientes
    await pwaService.loadPendingOperations();

    // Cargar eventos desde la API al iniciar
    await this.fetchEvents();

    // Configurar listeners para PWA
    this.setupPWAListeners();

    // Verificar parámetros de URL para acciones rápidas
    this.checkURLParams();
  },
  methods: {
    setupPWAListeners() {
      // Escuchar sincronización completada
      window.addEventListener('sync-complete', () => {
        this.fetchEvents(); // Recargar eventos después de sincronizar
      });

      // Escuchar cambios de conectividad
      window.addEventListener('connectivity-change', (event) => {
        if (event.detail.isOnline) {
          // Cuando vuelva la conexión, sincronizar
          pwaService.syncPendingOperations();
        }
      });
    },

    checkURLParams() {
      // Verificar si se abrió con acción rápida
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('action') === 'create') {
        this.handleCreateEvent();
      }
    },

    async fetchEvents() {
      this.loading = true;
      this.error = null;
      try {
        const events = await api.getEvents();
        // Convertir las fechas de string a objetos Date si es necesario
        this.events = events.map(event => ({
          ...event,
          start: event.start instanceof Date ? event.start : new Date(event.start),
          end: event.end instanceof Date ? event.end : new Date(event.end)
        }));
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        if (pwaService.isAppOnline()) {
          this.error = 'No se pudieron cargar los eventos. Por favor, intenta de nuevo más tarde.';
        } else {
          this.error = 'Sin conexión. Mostrando eventos guardados localmente.';
        }
      } finally {
        this.loading = false;
      }
    },

    handleEventSelected(eventInfo) {
      this.selectedEvent = {
        ...eventInfo.event.extendedProps,
        id: eventInfo.event.id,
        title: eventInfo.event.title,
        start: eventInfo.event.start,
        end: eventInfo.event.end,
        color: eventInfo.event.backgroundColor || '#3788d8',
        completed: eventInfo.event.extendedProps.completed || false
      };
      this.showEventForm = true;
    },

    handleDateSelected(info) {
      // Crear un nuevo evento en la fecha seleccionada
      this.selectedEvent = {
        title: '',
        start: info.start,
        end: info.end || new Date(info.start.getTime() + 60 * 60 * 1000), // Por defecto 1 hora
        description: '',
        color: '#3788d8',
        completed: false
      };
      this.showEventForm = true;
    },

    handleCreateEvent() {
      // Crear un nuevo evento con la fecha actual
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      this.selectedEvent = {
        title: '',
        start: now,
        end: oneHourLater,
        description: '',
        color: '#3788d8',
        completed: false
      };
      this.showEventForm = true;
    },

    async saveEvent(eventData) {
      this.formLoading = true;
      try {
        // Preparar datos para la API
        const apiEventData = {
          title: eventData.title,
          start: eventData.start,
          end: eventData.end,
          description: eventData.description || "",
          color: eventData.color,
          completed: eventData.completed || false
        };

        if (eventData.id && !eventData.id.toString().startsWith('temp_')) {
          // Actualizar evento existente
          await api.updateEvent(eventData.id, apiEventData);
        } else {
          // Crear nuevo evento
          await api.createEvent(apiEventData);
        }

        // Recargar todos los eventos para mantener la sincronización
        await this.fetchEvents();

        this.showEventForm = false;
        this.selectedEvent = null;

        // Mostrar mensaje de éxito
        if (!this.isOnline) {
          this.showToast('Evento guardado. Se sincronizará cuando vuelva la conexión.');
        }

      } catch (error) {
        console.error('Error al guardar evento:', error);
        this.showToast('Hubo un error al guardar el evento. Por favor, intenta de nuevo.', 'error');
      } finally {
        this.formLoading = false;
      }
    },

    async toggleEventComplete(eventId, completed) {
      this.formLoading = true;
      try {
        await api.toggleEventComplete(eventId, completed);
        // Recargar eventos para actualizar la vista
        await this.fetchEvents();
        // Actualizar el evento seleccionado si está abierto
        if (this.selectedEvent && this.selectedEvent.id === eventId) {
          this.selectedEvent.completed = completed;
        }
      } catch (error) {
        console.error('Error al cambiar estado del evento:', error);
        this.showToast('Hubo un error al cambiar el estado del evento.', 'error');
      } finally {
        this.formLoading = false;
      }
    },

    cancelEvent() {
      this.showEventForm = false;
      this.selectedEvent = null;
    },

    async deleteEvent(eventId) {
      if (!eventId) return;

      this.formLoading = true;
      try {
        await api.deleteEvent(eventId);
        // Recargar eventos después de eliminar
        await this.fetchEvents();
        this.showEventForm = false;
        this.selectedEvent = null;
      } catch (error) {
        console.error('Error al eliminar evento:', error);
        this.showToast('Hubo un error al eliminar el evento.', 'error');
      } finally {
        this.formLoading = false;
      }
    },

    // Función auxiliar para mostrar mensajes toast
    showToast(message, type = 'info') {
      // Implementación simple de toast
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#dc3545' : '#42b983'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10000;
        animation: slideUp 0.3s ease-out;
      `;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    },
    // Método para verificar estado PWA
    checkPWAStatus() {
      return {
        isOnline: pwaService.isAppOnline(),
        isInstalled: pwaService.isAppInstalled(),
        canInstall: !!pwaService.getInstallPrompt()
      };
    },
  },
  computed: {
    isOnline() {
      return pwaService.isAppOnline();
    }
  },
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 10px;
  }
}

.calendar-container {
  margin-bottom: 20px;

  h1 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 2rem;

    @media (max-width: 768px) {
      font-size: 1.5rem;
      margin-bottom: 15px;
    }
  }
}

.error-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  p {
    color: #dc3545;
    font-size: 1.2rem;
    margin-bottom: 15px;
    text-align: center;
  }

  .btn-retry {
    padding: 8px 16px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: darken(#42b983, 10%);
    }
  }
}

@media (min-width: 768px) {
  .main-content {
    flex-direction: row;

    .calendar-container {
      flex: 3;
      margin-right: 20px;
      margin-bottom: 0;
    }

    .event-form-container {
      flex: 1;
    }
  }
}

// Animaciones para toasts
@keyframes slideUp {
  from {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }

  to {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
  }
}

// Mejoras para PWA
@media (display-mode: standalone) {
  .app-container {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

// Optimizaciones para rendimiento
* {
  box-sizing: border-box;
}

img {
  max-width: 100%;
  height: auto;
}

// Scroll suave
html {
  scroll-behavior: smooth;
}

// Mejoras de accesibilidad
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
