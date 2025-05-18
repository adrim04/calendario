<template>
  <div class="app-container">
    <NavBar />
    <main class="main-content">
      <div class="calendar-container">
        <h1>Mi Calendario</h1>
        <Calendar 
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
      />
    </main>
    <Footer />
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import Calendar from './components/Calendar.vue'
import EventForm from './components/EventForm.vue'

export default {
  name: 'App',
  components: {
    //HelloWorld,
    NavBar,
    Footer,
    Calendar,
    EventForm
  },
  data() {
    return {
      events: [],
      showEventForm: false,
      selectedEvent: null
    }
  },
  created() {
    // Cargar eventos desde localStorage al iniciar
    this.loadEventsFromStorage();
  },
  methods: {
    loadEventsFromStorage() {
      const savedEvents = localStorage.getItem('calendar-events');
      if (savedEvents) {
        try {
          const parsedEvents = JSON.parse(savedEvents);
          // Convertir las fechas de string a objetos Date
          this.events = parsedEvents.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
          }));
        } catch (e) {
          console.error('Error parsing events from localStorage', e);
          this.events = [];
        }
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
        id: Date.now().toString(), // ID temporal
        title: '',
        start: info.start,
        end: info.end || new Date(info.start.getTime() + 60 * 60 * 1000), // Por defecto 1 hora
        description: '',
        color: '#3788d8'
      };
      this.showEventForm = true;
    },
    saveEvent(eventData) {
      // Verificar si el evento ya existe
      const existingEventIndex = this.events.findIndex(e => e.id === eventData.id);
      
      // Crear una copia limpia del evento para evitar referencias circulares
      const cleanEvent = {
        id: eventData.id,
        title: eventData.title,
        start: new Date(eventData.start),
        end: new Date(eventData.end),
        description: eventData.description,
        color: eventData.color
      };
      
      if (existingEventIndex >= 0) {
        // Actualizar evento existente
        this.events.splice(existingEventIndex, 1, cleanEvent);
      } else {
        // Agregar nuevo evento
        this.events.push(cleanEvent);
      }
      
      // Guardar en localStorage
      this.saveEventsToStorage();
      
      this.showEventForm = false;
      this.selectedEvent = null;
    },
    saveEventsToStorage() {
      localStorage.setItem('calendar-events', JSON.stringify(this.events));
    },
    cancelEvent() {
      this.showEventForm = false;
      this.selectedEvent = null;
    },
    deleteEvent(eventId) {
      this.events = this.events.filter(event => event.id !== eventId);
      this.saveEventsToStorage();
      this.showEventForm = false;
      this.selectedEvent = null;
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
