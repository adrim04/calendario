<template>
  <div class="app-container">
    <NavBar @create-event="handleCreateEvent" />
    <main class="main-content">
      <div class="calendar-container">
        <h1>Mi Calendario</h1>
        <div v-if="loading" class="loading-indicator">
          <p>Cargando eventos...</p>
        </div>
        <div v-if="error" class="error-message">
          <p>{{ error }}</p>
          <button @click="fetchEvents" class="btn btn-retry">Reintentar</button>
        </div>
        <Calendar 
          v-if="!loading && !error"
          ref="calendar"
          :events="events" 
          @event-selected="handleEventSelected"
          @date-selected="handleDateSelected"
        />
      </div>
      
      <EventForm 
        v-if="showEventForm" 
        :event="selectedEvent" 
        @save="saveEvent" 
        @cancel="cancelEvent"
        @delete="deleteEvent"
        :loading="formLoading"
      />
    </main>
    <Footer />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import Calendar from './components/Calendar.vue'
import EventForm from './components/EventForm.vue'
import api from './services/api'

export default {
  name: 'App',
  components: {
    NavBar,
    Footer,
    Calendar,
    EventForm
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
    // Cargar eventos desde la API al iniciar
    await this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      this.loading = true;
      this.error = null;
      try {
        const events = await api.getEvents();
        // Convertir las fechas de string a objetos Date
        this.events = events.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        this.error = 'No se pudieron cargar los eventos. Por favor, intenta de nuevo más tarde.';
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
        color: eventInfo.event.backgroundColor || '#3788d8'
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
        color: '#3788d8'
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
        color: '#3788d8'
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
          color: eventData.color
        };
        
        if (eventData.id) {
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
      } catch (error) {
        console.error('Error al guardar evento:', error);
        alert('Hubo un error al guardar el evento. Por favor, intenta de nuevo.');
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
        alert('Hubo un error al eliminar el evento. Por favor, intenta de nuevo.');
      } finally {
        this.formLoading = false;
      }
    }
  }
}
</script>


<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.calendar-container {
  margin-bottom: 20px;
  
  h1 {
    color: #2c3e50;
    margin-bottom: 20px;
  }
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  p {
    color: #666;
    font-size: 1.2rem;
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
</style>
