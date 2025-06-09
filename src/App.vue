<template>
<<<<<<< HEAD
  <div id="app">
    <NavBar />
    <main class="main-content">
      <div class="calendar-container">
        <CalendarView />
      </div>
    </main>
    <FooterComponent />
=======
  <div class="app-container">
    <!-- Indicadores PWA -->
    <OfflineIndicator />
    <PWAInstallPrompt />

    <NavBar 
      @create-event="handleCreateEvent" 
      @toggle-customizer="toggleCustomizer" 
    />
    
    <main class="main-content" :class="{ 'with-form': showEventForm }">
      <div class="content-layout">
        <div class="calendar-section" :class="{ 'form-open': showEventForm }">
          <!-- Loading y Error States -->
          <LoadingSpinner v-if="loading" size="large" message="Cargando eventos..." />
          
          <div v-else-if="error" class="error-message">
            <p>{{ error }}</p>
            <button @click="fetchEvents" class="btn btn-retry">Reintentar</button>
          </div>

          <!-- Calendar -->
          <div v-else class="calendar-container">
            <Calendar 
              ref="calendar" 
              :events="events" 
              @event-selected="handleEventSelected"
              @date-selected="handleDateSelected" 
            />
          </div>
        </div>

        <!-- Event Form Sidebar -->
        <div v-if="showEventForm" class="form-section">
          <EventForm 
            :event="selectedEvent" 
            :loading="formLoading"
            @save="saveEvent" 
            @cancel="closeEventForm"
            @delete="deleteEvent" 
            @toggle-complete="toggleEventComplete" 
          />
        </div>
      </div>
    </main>
    
    <Footer />

    <!-- Loading Overlay -->
    <LoadingSpinner v-if="formLoading" overlay message="Guardando..." />

    <!-- Theme Customizer -->
    <div v-if="showCustomizer" class="customizer-overlay" @click="closeCustomizer">
      <div class="customizer-container" @click.stop>
        <ThemeCustomizer 
          @close="closeCustomizer"
          @theme-changed="handleThemeChange"
          @font-changed="handleFontChange"
        />
      </div>
    </div>
>>>>>>> 5e78e1a (cambios)
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
<<<<<<< HEAD
import CalendarView from './components/Calendar.vue'
import FooterComponent from './components/Footer.vue'
=======
import Footer from './components/Footer.vue'
import Calendar from './components/Calendar.vue'
import EventForm from './components/EventForm.vue'
import OfflineIndicator from './components/OfflineIndicator.vue'
import PWAInstallPrompt from './components/PWAInstallPrompt.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import ThemeCustomizer from './components/ThemeCustomizer.vue'
import api from './services/api-offline'
import pwaService from './services/pwa'
import { themeService } from './services/themeService.js'
>>>>>>> 5e78e1a (cambios)

export default {
  name: 'App',
  components: {
    NavBar,
<<<<<<< HEAD
    CalendarView,
    FooterComponent
=======
    Footer,
    Calendar,
    EventForm,
    OfflineIndicator,
    PWAInstallPrompt,
    LoadingSpinner,
    ThemeCustomizer
  },
  data() {
    return {
      events: [],
      showEventForm: false,
      selectedEvent: null,
      loading: true,
      formLoading: false,
      error: null,
      showCustomizer: false,
      isOnline: navigator.onLine
    }
  },
  async created() {
    await this.initializeApp();
  },
  beforeUnmount() {
    this.cleanup();
  },
  methods: {
    // === INICIALIZACIÓN ===
    async initializeApp() {
      try {
        // Cargar tema
        themeService.loadTheme();
        
        // Configurar listeners
        this.setupEventListeners();
        
        // Cargar operaciones PWA pendientes
        await pwaService.loadPendingOperations();
        
        // Cargar eventos
        await this.fetchEvents();
        
        // Verificar parámetros URL
        this.handleURLParams();
        
      } catch (error) {
        console.error('Error inicializando la aplicación:', error);
        this.showToast('Error al inicializar la aplicación', 'error');
      }
    },

    setupEventListeners() {
      // Conectividad
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      
      // PWA Events
      window.addEventListener('sync-complete', this.handleSyncComplete);
      window.addEventListener('connectivity-change', this.handleConnectivityChange);
      window.addEventListener('sync-error', this.handleSyncError);
    },

    cleanup() {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
      window.removeEventListener('sync-complete', this.handleSyncComplete);
      window.removeEventListener('connectivity-change', this.handleConnectivityChange);
      window.removeEventListener('sync-error', this.handleSyncError);
    },

    // === EVENT LISTENERS ===
    handleOnline() {
      this.isOnline = true;
      this.showToast('Conexión restaurada', 'success');
      pwaService.syncPendingOperations();
    },

    handleOffline() {
      this.isOnline = false;
      this.showToast('Sin conexión a internet', 'warning');
    },

    handleSyncComplete() {
      this.fetchEvents();
      this.showToast('Sincronización completada', 'success');
    },

    handleConnectivityChange(event) {
      if (event.detail.isOnline) {
        pwaService.syncPendingOperations();
      }
    },

    handleSyncError(event) {
      console.error('Error de sincronización:', event.detail);
      this.showToast('Error al sincronizar datos', 'error');
    },

    // === URL HANDLING ===
    handleURLParams() {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('action') === 'create') {
        this.handleCreateEvent();
      }
    },

    // === DATA FETCHING ===
    async fetchEvents() {
      this.loading = true;
      this.error = null;
      
      try {
        const events = await api.getEvents();
        this.events = this.normalizeEvents(events);
      } catch (error) {
        await this.handleFetchError(error);
      } finally {
        this.loading = false;
      }
    },

    normalizeEvents(events) {
      return events.map(event => ({
        ...event,
        start: event.start instanceof Date ? event.start : new Date(event.start),
        end: event.end instanceof Date ? event.end : new Date(event.end)
      }));
    },

    async handleFetchError(error) {
      console.error('Error al cargar eventos:', error);
      
      if (this.isOnline) {
        this.error = 'No se pudieron cargar los eventos. Por favor, intenta de nuevo más tarde.';
      } else {
        this.error = 'Sin conexión. Mostrando eventos guardados localmente.';
        try {
          const cachedEvents = await api.getCachedEvents();
          this.events = cachedEvents || [];
          this.error = null;
        } catch (cacheError) {
          console.error('Error al cargar eventos del cache:', cacheError);
        }
      }
    },

    // === EVENT HANDLING ===
    handleEventSelected(eventInfo) {
      this.selectedEvent = this.createEventFromInfo(eventInfo);
      this.showEventForm = true;
    },

    handleDateSelected(info) {
      this.selectedEvent = this.createNewEvent(info.start, info.end);
      this.showEventForm = true;
    },

    handleCreateEvent() {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      this.selectedEvent = this.createNewEvent(now, oneHourLater);
      this.showEventForm = true;
    },

    createEventFromInfo(eventInfo) {
      return {
        ...eventInfo.event.extendedProps,
        id: eventInfo.event.id,
        title: eventInfo.event.title,
        start: eventInfo.event.start,
        end: eventInfo.event.end,
        color: eventInfo.event.backgroundColor || '#3788d8',
        completed: eventInfo.event.extendedProps.completed || false
      };
    },

    createNewEvent(start, end = null) {
      return {
        title: '',
        start,
        end: end || new Date(start.getTime() + 60 * 60 * 1000),
        description: '',
        color: '#3788d8',
        completed: false
      };
    },

    // === FORM ACTIONS ===
    async saveEvent(eventData) {
      this.formLoading = true;
      
      try {
        const apiEventData = this.prepareEventData(eventData);
        
        if (this.isExistingEvent(eventData)) {
          await api.updateEvent(eventData.id, apiEventData);
          this.showToast('Evento actualizado correctamente', 'success');
        } else {
          await api.createEvent(apiEventData);
          this.showToast('Evento creado correctamente', 'success');
        }

        await this.fetchEvents();
        this.closeEventForm();

        if (!this.isOnline) {
          this.showToast('Se sincronizará cuando vuelva la conexión', 'info');
        }

      } catch (error) {
        console.error('Error al guardar evento:', error);
        this.showToast('Error al guardar el evento. Intenta de nuevo.', 'error');
      } finally {
        this.formLoading = false;
      }
    },

    prepareEventData(eventData) {
      return {
        title: eventData.title,
        start: eventData.start,
        end: eventData.end,
        description: eventData.description || "",
        color: eventData.color,
        completed: eventData.completed || false
      };
    },

    isExistingEvent(eventData) {
      return eventData.id && !eventData.id.toString().startsWith('temp_');
    },

    async toggleEventComplete(eventId, completed) {
      this.formLoading = true;
      
      try {
        await api.toggleEventComplete(eventId, completed);
        await this.fetchEvents();
        
        // Actualizar evento seleccionado si coincide
        if (this.selectedEvent?.id === eventId) {
          this.selectedEvent.completed = completed;
        }
        
        const message = completed ? 'Evento marcado como completado' : 'Evento marcado como pendiente';
        this.showToast(message, 'success');
        
      } catch (error) {
        console.error('Error al cambiar estado del evento:', error);
        this.showToast('Error al cambiar el estado del evento.', 'error');
      } finally {
        this.formLoading = false;
      }
    },

    async deleteEvent(eventId) {
      if (!eventId || !confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        return;
      }

      this.formLoading = true;
      
      try {
        await api.deleteEvent(eventId);
        await this.fetchEvents();
        this.closeEventForm();
        this.showToast('Evento eliminado correctamente', 'success');
        
      } catch (error) {
        console.error('Error al eliminar evento:', error);
        this.showToast('Error al eliminar el evento.', 'error');
      } finally {
        this.formLoading = false;
      }
    },

    closeEventForm() {
      this.showEventForm = false;
      this.selectedEvent = null;
    },

    // === CUSTOMIZER ===
    toggleCustomizer() {
      this.showCustomizer = !this.showCustomizer;
    },

    closeCustomizer() {
      this.showCustomizer = false;
    },

    handleThemeChange(theme) {
      console.log('Tema cambiado a:', theme);
      this.showToast(`Tema cambiado a: ${theme}`, 'success');
    },
    
    handleFontChange(font) {
      console.log('Fuente cambiada a:', font);
      this.showToast(`Fuente cambiada a: ${font}`, 'success');
    },

    // === TOAST NOTIFICATIONS ===
    showToast(message, type = 'info') {
      // Limpiar toasts existentes
      this.clearExistingToasts();
      
      const toast = this.createToastElement(message, type);
      document.body.appendChild(toast);
      
      // Auto-remove
      setTimeout(() => this.removeToast(toast), 4000);
    },

    clearExistingToasts() {
      const existingToasts = document.querySelectorAll('.toast');
      existingToasts.forEach(toast => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      });
    },

    createToastElement(message, type) {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      const iconMap = {
        error: '⚠️',
        success: '✅',
        warning: '⚡',
        info: 'ℹ️'
      };
      
      const colorMap = {
        error: 'var(--color-accent, #e74c3c)',
        success: 'var(--color-primary, #27ae60)',
        warning: 'var(--color-warning, #f39c12)',
        info: 'var(--color-secondary, #3498db)'
      };

      toast.innerHTML = `
        <div class="toast-icon">${iconMap[type]}</div>
        <div class="toast-content">${message}</div>
      `;
      
      toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colorMap[type]};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        backdrop-filter: blur(10px);
        animation: slideUp 0.3s ease-out;
        max-width: 90vw;
        word-wrap: break-word;
      `;
      
      this.ensureToastStyles();
      return toast;
    },

    ensureToastStyles() {
      if (document.querySelector('#toast-animations')) return;
      
      const style = document.createElement('style');
      style.id = 'toast-animations';
      style.textContent = `
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100%); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(0); opacity: 1; }
          to { transform: translateX(-50%) translateY(100%); opacity: 0; }
        }
        .toast-icon { font-size: 16px; flex-shrink: 0; }
        .toast-content { flex: 1; }
      `;
      document.head.appendChild(style);
    },

    removeToast(toast) {
      if (!document.body.contains(toast)) return;
      
      toast.style.animation = 'slideDown 0.3s ease-in forwards';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }
>>>>>>> 5e78e1a (cambios)
  }
}
</script>

<<<<<<< HEAD
<style lang="scss">
@import './assets/styles/main.scss';

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
=======
<style lang="scss" scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background, #f8f9fa);
  color: var(--color-text, #333);
  font-family: var(--font-family, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
>>>>>>> 5e78e1a (cambios)
}

.main-content {
  flex: 1;
<<<<<<< HEAD
  display: flex;
  flex-direction: column;
}

.calendar-container {
  flex: 1;
  padding: 20px;
  
  @include respond-to('tablet') {
    padding: 15px;
  }
  
  @include respond-to('mobile') {
    padding: 10px;
  }
}
=======
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.content-layout {
  display: flex;
  gap: 24px;
  min-height: 600px;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 20px;
  }
}

.calendar-section {
  flex: 1;
  min-width: 0;
  transition: all 0.3s ease;
  
  &.form-open {
    @media (min-width: 1025px) {
      flex: 0 0 calc(100% - 440px);
      max-width: calc(100% - 440px);
    }
  }
}

.form-section {
  flex: 0 0 400px;
  min-height: fit-content;
  animation: slideInFromRight 0.4s ease-out;
  
  @media (max-width: 1024px) {
    flex: none;
    width: 100%;
    animation: slideInFromBottom 0.4s ease-out;
    order: -1;
  }
}

.calendar-container {
  background: var(--color-surface, white);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-height: 500px;
  
  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }
}

.error-message {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 2px solid var(--color-accent, #fecaca);
  border-radius: 16px;
  margin: 20px 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  
  p {
    color: #dc2626;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;
  }
  
  .btn-retry {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #b91c1c, #991b1b);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
    }
  }
}

.customizer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

.customizer-container {
  background: var(--color-surface, white);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  animation: scaleIn 0.3s ease-out;
}

// Animaciones
@keyframes slideInFromRight {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInFromBottom {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

// Responsive
@media (max-width: 1024px) {
  .main-content { padding: 16px; }
  .calendar-container { padding: 20px; }
}

@media (max-width: 768px) {
  .main-content { padding: 12px; }
  .calendar-container { padding: 16px; border-radius: 12px; }
  .content-layout { gap: 16px; }
}

@media (max-width: 480px) {
  .main-content { padding: 8px; }
  .calendar-container { padding: 12px; border-radius: 8px; }
  .content-layout { gap: 12px; }
  .customizer-container {
    margin: 10px;
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
    border-radius: 12px;
  }
}

// Accesibilidad
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .form-section,
  .customizer-overlay,
  .customizer-container {
    animation: none;
  }
}
>>>>>>> 5e78e1a (cambios)
</style>