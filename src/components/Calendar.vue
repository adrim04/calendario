<template>
  <div class="calendar-wrapper fade-in">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando calendario...</p>
    </div>
    
    <!-- Calendar content -->
    <div v-else>
      <div class="calendar-header">
        <button @click="previousMonth" class="btn btn-action" :disabled="loading">
          ‹
        </button>
        <h2>{{ currentMonthYear }}</h2>
        <button @click="nextMonth" class="btn btn-action" :disabled="loading">
          ›
        </button>
        <div class="view-options">
          <button 
            @click="currentView = 'month'" 
            :class="{ active: currentView === 'month' }" 
            class="btn"
          >
            Mes
          </button>
          <button 
            @click="currentView = 'week'" 
            :class="{ active: currentView === 'week' }" 
            class="btn hide-mobile"
          >
            Semana
          </button>
        </div>
        <button @click="openNewEventModal" class="btn btn-primary pulse">
          + <span class="hide-mobile">Nuevo Evento</span>
        </button>
      </div>
      
      <!-- Calendar Grid -->
      <div class="calendar-grid">
        <!-- Days of week header -->
        <div class="calendar-header-days">
          <div v-for="day in daysOfWeek" :key="day" class="day-header">
            {{ day }}
          </div>
        </div>
        
        <!-- Calendar days -->
        <div class="calendar-days">
          <div 
            v-for="day in calendarDays" 
            :key="day.date"
            class="calendar-day"
            :class="{
              'other-month': !day.isCurrentMonth,
              'today': day.isToday,
              'has-events': day.events.length > 0,
              'selected': selectedDate === day.date
            }"
            @click="selectDate(day)"
          >
            <span class="day-number">{{ day.day }}</span>
            <div class="day-events">
              <div 
                v-for="event in day.events.slice(0, 3)" 
                :key="event.id"
                class="event-item"
                :style="{ backgroundColor: event.color }"
                @click.stop="editEvent(event)"
                :title="event.title"
              >
                <span class="event-title">{{ event.title }}</span>
                <span v-if="event.time" class="event-time">{{ event.time }}</span>
              </div>
              <div v-if="day.events.length > 3" class="more-events" @click.stop="showDayEvents(day)">
                +{{ day.events.length - 3 }} más
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Event Modal -->
    <div v-if="showEventModal" class="event-modal" @click.self="closeModal">
      <div class="event-modal-content slide-in">
        <EventForm 
          :event="selectedEvent"
          :selected-date="selectedDate"
          @save="saveEvent"
          @delete="deleteEvent"
          @cancel="closeModal"
        />
      </div>
    </div>
    
    <!-- Day Events Modal -->
    <div v-if="showDayModal" class="day-modal" @click.self="closeDayModal">
      <div class="day-modal-content slide-in">
        <div class="day-modal-header">
          <h3>Eventos del {{ formatSelectedDate }}</h3>
          <button @click="closeDayModal" class="btn-close">×</button>
        </div>
        <div class="day-modal-body">
          <div v-if="selectedDayEvents.length === 0" class="no-events">
            No hay eventos para este día
          </div>
          <EventCard 
            v-for="event in selectedDayEvents" 
            :key="event.id"
            :event="event"
            @edit="editEvent"
            @delete="confirmDeleteEvent"
          />
        </div>
      </div>
    </div>
    
    <!-- Notificaciones -->
    <div v-if="notification.show" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
<<<<<<< HEAD
import { ref, computed, onMounted } from 'vue'
import EventForm from './EventForm.vue'
import EventCard from './EventCard.vue'
=======
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { themeService } from '@/services/themeService'
>>>>>>> 5e78e1a (cambios)

export default {
  name: 'CalendarView',
  components: {
    EventForm,
    EventCard
  },
<<<<<<< HEAD
  setup() {
    // Reactive data
    const loading = ref(false)
    const currentDate = ref(new Date())
    const currentView = ref('month')
    const showEventModal = ref(false)
    const showDayModal = ref(false)
    const selectedEvent = ref(null)
    const selectedDate = ref(null)
    const selectedDayEvents = ref([])
    
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    
    const events = ref([
      {
        id: '1',
        title: 'Reunión de equipo',
        date: '2025-01-15',
        time: '10:00',
        color: '#4a6fa5',
        description: 'Discutir avances del proyecto MyScheduler'
      },
      {
        id: '2',
        title: 'Entrega Sprint 2',
        date: '2025-01-20',
        time: '14:00',
        color: '#28a745',
        description: 'Entrega final del segundo sprint'
      },
      {
        id: '3',
        title: 'Presentación final',
        date: '2025-01-28',
        time: '16:00',
        color: '#dc3545',
        description: 'Presentación del proyecto completo'
      }
    ])
    
    const notification = ref({
      show: false,
      message: '',
      type: 'success'
    })

    // Computed properties
    const currentMonthYear = computed(() => {
      return `${monthNames[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
    })
    
    const formatSelectedDate = computed(() => {
      if (!selectedDate.value) return ''
      const date = new Date(selectedDate.value)
      return date.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    })
    
    const calendarDays = computed(() => {
      const year = currentDate.value.getFullYear()
      const month = currentDate.value.getMonth()
      
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())
      
      const endDate = new Date(lastDay)
      endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))
      
      const days = []
      const currentDateLoop = new Date(startDate)
      
      while (currentDateLoop <= endDate) {
        const dayEvents = getEventsForDate(currentDateLoop)
        
        days.push({
          date: new Date(currentDateLoop).toISOString().split('T')[0],
          day: currentDateLoop.getDate(),
          isCurrentMonth: currentDateLoop.getMonth() === month,
          isToday: isToday(currentDateLoop),
          events: dayEvents
        })
        
        currentDateLoop.setDate(currentDateLoop.getDate() + 1)
      }
      
      return days
    })

    // Methods
    const loadEvents = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        loading.value = false
      } catch (error) {
        console.error('Error al cargar eventos:', error)
        showNotification('Error al cargar los eventos', 'error')
        loading.value = false
      }
    }
    
    const previousMonth = () => {
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
    }
    
    const nextMonth = () => {
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
    }
    
    const isToday = (date) => {
      const today = new Date()
      return date.toDateString() === today.toDateString()
    }
    
    const getEventsForDate = (date) => {
      const dateStr = date.toISOString().split('T')[0]
      return events.value.filter(event => event.date === dateStr)
    }
    
    const selectDate = (day) => {
      selectedDate.value = day.date
      selectedEvent.value = null
      showEventModal.value = true
    }
    
    const openNewEventModal = () => {
      selectedDate.value = new Date().toISOString().split('T')[0]
      selectedEvent.value = null
      showEventModal.value = true
    }
    
    const editEvent = (event) => {
      selectedEvent.value = { ...event }
      selectedDate.value = event.date
      showEventModal.value = true
      closeDayModal()
    }
    
    const showDayEvents = (day) => {
      selectedDate.value = day.date
      selectedDayEvents.value = day.events
      showDayModal.value = true
    }
    
    const saveEvent = async (eventData) => {
      loading.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (eventData.id) {
          const index = events.value.findIndex(e => e.id === eventData.id)
          if (index !== -1) {
            events.value[index] = eventData
          }
          showNotification('Evento actualizado correctamente', 'success')
        } else {
          eventData.id = Date.now().toString()
          events.value.push(eventData)
          showNotification('Evento creado correctamente', 'success')
        }
        
        closeModal()
      } catch (error) {
        console.error('Error al guardar evento:', error)
        showNotification('Error al guardar el evento', 'error')
      } finally {
        loading.value = false
      }
    }
    
    const confirmDeleteEvent = (event) => {
      selectedEvent.value = event
      deleteEvent(event.id)
    }
    
    const deleteEvent = async (eventId) => {
      if (!confirm('¿Estás segura de que quieres eliminar este evento?')) {
        return
      }
      
      loading.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const index = events.value.findIndex(e => e.id === eventId)
        if (index !== -1) {
          events.value.splice(index, 1)
        }
        
        showNotification('Evento eliminado correctamente', 'success')
        closeModal()
        closeDayModal()
      } catch (error) {
        console.error('Error al eliminar evento:', error)
        showNotification('Error al eliminar el evento', 'error')
      } finally {
        loading.value = false
      }
    }
    
    const closeModal = () => {
      showEventModal.value = false
      selectedEvent.value = null
      selectedDate.value = null
    }
    
    const closeDayModal = () => {
      showDayModal.value = false
      selectedDayEvents.value = []
    }
    
    const showNotification = (message, type = 'success') => {
      notification.value = {
        show: true,
        message,
        type
      }
      
      setTimeout(() => {
        notification.value.show = false
      }, 3000)
    }

    // Lifecycle
    onMounted(() => {
      loadEvents()
    })

    return {
      loading,
      currentDate,
      currentView,
      showEventModal,
      showDayModal,
      selectedEvent,
      selectedDate,
      selectedDayEvents,
      daysOfWeek,
      events,
      notification,
      currentMonthYear,
      formatSelectedDate,
      calendarDays,
      loadEvents,
      previousMonth,
      nextMonth,
      selectDate,
      openNewEventModal,
      editEvent,
      showDayEvents,
      saveEvent,
      confirmDeleteEvent,
      deleteEvent,
      closeModal,
      closeDayModal,
      showNotification
=======
  props: {
    events: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      themeService,
      currentTheme: null,
      isMobile: false,
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        locale: esLocale,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        height: 'auto',
        slotEventOverlap: false,
        forceEventDuration: true,
        slotMinTime: '00:00:00',
        slotMaxTime: '24:00:00',
        allDaySlot: false,
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        },
        // Configuración responsiva
        aspectRatio: 1.35,
        handleWindowResize: true,
        windowResizeDelay: 100
      }
    }
  },
  mounted() {
    this.setupResponsiveDesign();
    this.rebuildEvents(this.events);
    this.updateThemeColors();
    this.setupThemeWatcher();
    this.setupResizeListener();
  },
  beforeUnmount() {
    // Limpiar listeners
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
  },
  watch: {
    events: {
      handler(newEvents) {
        this.rebuildEvents(newEvents);
      },
      deep: true
    }
  },
  methods: {
    handleDateSelect(selectInfo) {
      this.$emit('date-selected', selectInfo)
    },
    handleEventClick(clickInfo) {
      this.$emit('event-selected', clickInfo)
    },
    setupResponsiveDesign() {
      this.checkScreenSize();
      this.updateCalendarView();
    },
    checkScreenSize() {
      this.isMobile = window.innerWidth <= 768;
    },
    updateCalendarView() {
      if (!this.$refs.fullCalendar) return;
      
      const calendarApi = this.$refs.fullCalendar.getApi();
      
      // Configuración responsiva del calendario
      if (this.isMobile) {
        // Móvil: simplificar toolbar y ajustar vista
        calendarApi.setOption('headerToolbar', {
          left: 'prev,next',
          center: 'title',
          right: 'today'
        });
        calendarApi.setOption('dayMaxEvents', 2);
        calendarApi.setOption('aspectRatio', 1.0);
        
        // Cambiar a vista de mes si está en vista de semana/día
        const currentView = calendarApi.view.type;
        if (currentView === 'timeGridWeek' || currentView === 'timeGridDay') {
          calendarApi.changeView('dayGridMonth');
        }
      } else {
        // Desktop: toolbar completo
        calendarApi.setOption('headerToolbar', {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        });
        calendarApi.setOption('dayMaxEvents', true);
        calendarApi.setOption('aspectRatio', 1.35);
      }
    },
    setupResizeListener() {
      // Usar ResizeObserver para mejor rendimiento
      if (window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(() => {
          this.checkScreenSize();
          this.updateCalendarView();
        });
        this.resizeObserver.observe(document.body);
      } else {
        // Fallback para navegadores antiguos
        window.addEventListener('resize', this.debounce(() => {
          this.checkScreenSize();
          this.updateCalendarView();
        }, 250));
      }
    },
    updateThemeColors() {
      this.currentTheme = this.themeService.themes[this.themeService.getCurrentTheme()];
      this.$nextTick(() => {
        this.applyThemeToCalendar();
      });
    },
    setupThemeWatcher() {
      // Observar cambios en el tema
      this.themeObserver = new MutationObserver(() => {
        const currentThemeName = this.themeService.getCurrentTheme();
        if (currentThemeName !== this.currentTheme?.name?.toLowerCase()) {
          this.updateThemeColors();
        }
      });
      
      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style']
      });
    },
    applyThemeToCalendar() {
      if (!this.currentTheme || !this.$refs.fullCalendar) return;
      
      const calendarElement = this.$refs.fullCalendar.$el;
      const colors = this.currentTheme.colors;
      
      // Aplicar colores personalizados al calendario usando CSS custom properties
      calendarElement.style.setProperty('--theme-primary', colors.primary);
      calendarElement.style.setProperty('--theme-secondary', colors.secondary);
      calendarElement.style.setProperty('--theme-accent', colors.accent);
      calendarElement.style.setProperty('--theme-background', colors.background);
      calendarElement.style.setProperty('--theme-surface', colors.surface);
      calendarElement.style.setProperty('--theme-text', colors.text);
      calendarElement.style.setProperty('--theme-text-secondary', colors.textSecondary);
    },
    rebuildEvents(events) {
      if (this.$refs.fullCalendar) {
        const calendarApi = this.$refs.fullCalendar.getApi();

        calendarApi.removeAllEvents();

        const uniqueEvents = this.removeDuplicateEvents(events);

        const formattedEvents = uniqueEvents.map(event => {
          let eventColor = event.color;
          let eventTitle = event.title;
          let textColor = '#ffffff';

          if (event.completed) {
            eventColor = this.darkenColor(event.color, 0.6);
            eventTitle = `✓ ${event.title}`;
            textColor = '#cccccc';
          }

          return {
            id: event.id,
            title: eventTitle,
            start: event.start,
            end: event.end,
            backgroundColor: eventColor,
            borderColor: this.darkenColor(eventColor, 0.8),
            textColor: textColor,
            classNames: event.completed ? ['completed-event'] : ['active-event'],
            extendedProps: {
              description: event.description,
              completed: event.completed
            }
          };
        });

        formattedEvents.forEach(event => {
          calendarApi.addEvent(event);
        });
      }
    },
    removeDuplicateEvents(events) {
      const uniqueIds = new Set();
      return events.filter(event => {
        if (uniqueIds.has(event.id)) {
          return false;
        }
        uniqueIds.add(event.id);
        return true;
      });
    },
    darkenColor(color, factor) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      const newR = Math.floor(r * factor);
      const newG = Math.floor(g * factor);
      const newB = Math.floor(b * factor);

      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    },
    // Función utilitaria para debounce
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
>>>>>>> 5e78e1a (cambios)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/main.scss';

.calendar-wrapper {
<<<<<<< HEAD
  @include card-style;
  margin: 20px 0;
  overflow: hidden;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
  
  .loading-spinner {
    @include loading-spinner;
    margin-bottom: 20px;
  }
  
  p {
    color: $secondary-color;
    font-size: 1.1rem;
  }
}

.calendar-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, $light-color 0%, darken($light-color, 5%) 100%);
  border-bottom: 1px solid $border-color;
  flex-wrap: wrap;
  gap: 15px;

  h2 {
    margin: 0;
    font-size: 1.8rem;
    flex-grow: 1;
    color: $primary-color;
    font-weight: 600;
    
    @include respond-to('tablet') {
      font-size: 1.5rem;
      order: 1;
      width: 100%;
      text-align: center;
    }
    
    @include respond-to('mobile') {
      font-size: 1.3rem;
    }
  }

  .view-options {
    display: flex;
    gap: 8px;
    
    @include respond-to('tablet') {
      order: 2;
      justify-content: center;
    }

    .btn {
      @include button-style($light-color, $dark-color);
      font-size: 0.9rem;
      
      &.active {
        @include button-style($primary-color);
      }
    }
  }
  
  .btn-action {
    @include button-style($primary-color);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    
    @include respond-to('tablet') {
      order: 0;
    }
  }
  
  .btn-primary {
    @include respond-to('tablet') {
      order: 3;
      margin: 0 auto;
=======
  background: linear-gradient(135deg, var(--color-background, #ffeef1) 0%, var(--color-surface, #fff5f7) 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin: 0;
  position: relative;
  overflow: hidden;
  font-family: var(--font-family, 'Inter', system-ui, sans-serif);
  width: 100%;
  box-sizing: border-box;

  // Decoraciones de fondo responsivas
  &::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: clamp(60px, 10vw, 100px);
    height: clamp(60px, 10vw, 100px);
    background: radial-gradient(circle, var(--color-primary, #FF9AA2) 0%, transparent 70%);
    border-radius: 50%;
    opacity: 0.1;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30px;
    left: -30px;
    width: clamp(50px, 8vw, 80px);
    height: clamp(50px, 8vw, 80px);
    background: radial-gradient(circle, var(--color-secondary, #FFB3C6) 0%, transparent 70%);
    border-radius: 50%;
    opacity: 0.08;
    pointer-events: none;
  }

  :deep(.fc) {
    font-family: var(--font-family, 'Inter', system-ui, sans-serif);
    
    // Toolbar responsivo
    .fc-toolbar {
      background: var(--color-surface, rgba(255, 255, 255, 0.9));
      border-radius: 15px;
      padding: clamp(10px, 3vw, 20px);
      margin-bottom: 20px;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--color-accent, rgba(255, 182, 193, 0.2));
      flex-wrap: wrap;
      gap: 10px;

      // Responsive toolbar layout
      @media (max-width: 768px) {
        .fc-toolbar-chunk {
          &:first-child, &:last-child {
            flex: 1;
            display: flex;
            justify-content: center;
          }
          &:nth-child(2) {
            flex: 100%;
            order: -1;
            text-align: center;
            margin-bottom: 10px;
          }
        }
      }
    }

    // Botones responsivos
    .fc-button-primary {
      background: linear-gradient(135deg, var(--color-primary, #ff9bb3) 0%, var(--color-secondary, #ffb3c6) 100%);
      border: none;
      border-radius: 12px;
      font-weight: 600;
      padding: clamp(6px, 2vw, 10px) clamp(10px, 3vw, 16px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      color: white;
      font-size: clamp(12px, 2.5vw, 14px);
      min-height: 36px;
      
      // Iconos en móvil
      @media (max-width: 480px) {
        padding: 8px 10px;
        font-size: 0;
        
        &.fc-prev-button::before {
          content: '‹';
          font-size: 18px;
          font-weight: bold;
        }
        
        &.fc-next-button::before {
          content: '›';
          font-size: 18px;
          font-weight: bold;
        }
        
        &.fc-today-button {
          font-size: 12px;
        }
      }

      &:hover:not(:disabled) {
        filter: brightness(0.95);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &:active {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.5;
        transform: none;
        cursor: not-allowed;
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px var(--color-accent, rgba(255, 155, 179, 0.4));
      }
    }

    // Título responsivo
    .fc-toolbar-title {
      font-size: clamp(1.2rem, 4vw, 1.8rem);
      font-weight: 700;
      color: var(--color-primary, #ff6b8a);
      margin: 0;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      line-height: 1.2;
      text-align: center;
    }

    // Tabla principal responsiva
    .fc-scrollgrid {
      border: none;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      background: var(--color-surface, rgba(255, 255, 255, 0.95));
      backdrop-filter: blur(10px);
      border: 1px solid var(--color-accent, rgba(255, 182, 193, 0.1));
    }

    // Encabezados de días responsivos
    .fc-col-header {
      background: linear-gradient(135deg, var(--color-primary, #ffb3c6) 0%, var(--color-secondary, #ffc9d4) 100%);
      
      .fc-col-header-cell {
        padding: clamp(8px, 2vw, 12px);
        border: none;
        
        .fc-col-header-cell-cushion {
          color: white;
          font-weight: 600;
          font-size: clamp(0.7rem, 2vw, 0.9rem);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }
    }

    // Celdas de días responsivas
    .fc-daygrid-day {
      border: 1px solid var(--color-accent, rgba(255, 182, 193, 0.1));
      background: var(--color-surface, rgba(255, 255, 255, 0.8));
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      min-height: clamp(60px, 12vw, 120px);

      &:hover {
        background: var(--color-background, rgba(255, 240, 245, 0.9));
        transform: scale(1.01);
        z-index: 2;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      // Números de días responsivos
      .fc-daygrid-day-number {
        color: var(--color-primary, #ff6b8a);
        font-weight: 600;
        font-size: clamp(0.8rem, 2.5vw, 1rem);
        padding: clamp(4px, 1.5vw, 8px) clamp(6px, 2vw, 12px);
        transition: all 0.3s ease;
        border-radius: 8px;
        margin: 2px;
      }

      // Día actual
      &.fc-day-today {
        background: linear-gradient(135deg, var(--color-accent, rgba(255, 182, 193, 0.15)) 0%, var(--color-background, rgba(255, 202, 212, 0.15)) 100%);
        
        .fc-daygrid-day-number {
          background: linear-gradient(135deg, var(--color-primary, #ff6b8a) 0%, var(--color-secondary, #ff8fa3) 100%);
          color: white;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      }

      // Días del mes anterior/siguiente
      &.fc-day-other {
        background: var(--color-surface, rgba(255, 255, 255, 0.4));
        
        .fc-daygrid-day-number {
          color: var(--color-text-secondary, #ffb3c6);
          opacity: 0.5;
        }
      }
    }

    // Eventos responsivos
    .fc-event {
      cursor: pointer;
      border: none;
      border-radius: 8px;
      margin: 1px 2px;
      padding: clamp(2px, 1vw, 4px) clamp(4px, 1.5vw, 8px);
      font-weight: 500;
      font-size: clamp(0.7rem, 2vw, 0.85rem);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
        z-index: 3;
      }

      .fc-event-title {
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      // Eventos activos
      &.active-event {
        border-left: 3px solid rgba(255, 255, 255, 0.8);
      }
    }

    // Eventos completados
    .completed-event {
      opacity: 0.7;
      
      .fc-event-title {
        text-decoration: line-through;
        opacity: 0.8;
      }
    }

    // Vista de tiempo responsiva
    .fc-timegrid-event {
      border-radius: 6px;
      padding: clamp(2px, 1vw, 4px) clamp(3px, 1vw, 6px);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

      .fc-event-time,
      .fc-event-title {
        padding: 0 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
        font-size: clamp(0.7rem, 2vw, 0.8rem);
      }
    }

    // Slots de tiempo responsivos
    .fc-timegrid-slot,
    .fc-timegrid-slot-lane {
      height: clamp(35px, 8vw, 45px) !important;
      border-color: var(--color-accent, rgba(255, 182, 193, 0.1));
    }

    // Eje de tiempo
    .fc-timegrid-axis {
      padding-right: clamp(5px, 2vw, 10px);
      text-align: right;
      color: var(--color-primary, #ff8fa3);
      font-weight: 500;
      font-size: clamp(0.7rem, 2vw, 0.8rem);
    }

    // Botón "más eventos" responsivo
    .fc-daygrid-more-link {
      background: linear-gradient(135deg, var(--color-primary, #ff9bb3) 0%, var(--color-secondary, #ffb3c6) 100%);
      color: white;
      border-radius: 6px;
      padding: clamp(1px, 0.5vw, 2px) clamp(3px, 1vw, 6px);
      font-size: clamp(0.6rem, 1.8vw, 0.75rem);
      font-weight: 600;
      border: none;
      transition: all 0.3s ease;
      text-align: center;

      &:hover {
        filter: brightness(0.95);
        transform: scale(1.02);
      }
    }

    // Popover responsivo
    .fc-popover {
      border: none;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      background: var(--color-surface, rgba(255, 255, 255, 0.95));
      backdrop-filter: blur(10px);
      border: 1px solid var(--color-accent, rgba(255, 182, 193, 0.2));
      max-width: 90vw;
      
      .fc-popover-header {
        background: var(--color-primary);
        color: white;
        font-weight: 600;
      }
    }

    // Scrollbars personalizados
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    ::-webkit-scrollbar-track {
      background: var(--color-background, #f1f1f1);
      border-radius: 3px;
    }

    ::-webkit-scrollbar-thumb {
      background: var(--color-primary, #ff9bb3);
      border-radius: 3px;
      
      &:hover {
        background: var(--color-secondary, #ffb3c6);
      }
    }
  }

  // Animaciones suaves
  * {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

// Responsive breakpoints
@media (max-width: 480px) {
  .calendar-wrapper {
    padding: 15px;
    border-radius: 15px;
    margin: 0 -5px;
    
    :deep(.fc) {
      .fc-toolbar {
        padding: 12px;
        border-radius: 12px;
        margin-bottom: 15px;
      }
      
      .fc-daygrid-day {
        min-height: 50px;
      }
      
      .fc-event {
        margin: 0.5px 1px;
        padding: 2px 4px;
        font-size: 0.65rem;
      }
>>>>>>> 5e78e1a (cambios)
    }
  }
}

<<<<<<< HEAD
.calendar-grid {
  padding: 20px;
  
  @include respond-to('mobile') {
    padding: 10px;
  }
}

.calendar-header-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 10px;
  
  .day-header {
    padding: 15px 5px;
    text-align: center;
    font-weight: 600;
    color: $primary-color;
    background-color: $light-color;
    border-radius: 4px;
    
    @include respond-to('mobile') {
      padding: 10px 2px;
      font-size: 0.8rem;
    }
  }
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: $border-color;
  border-radius: 8px;
  overflow: hidden;
}

.calendar-day {
  background-color: white;
  min-height: 120px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  @include respond-to('mobile') {
    min-height: 80px;
    padding: 4px;
  }
  
  &:hover {
    background-color: lighten($primary-color, 45%);
    transform: scale(1.02);
  }
  
  &.other-month {
    background-color: $light-color;
    color: $secondary-color;
    
    .day-number {
      opacity: 0.5;
    }
  }
  
  &.today {
    background-color: lighten($primary-color, 40%);
    
    .day-number {
      background-color: $primary-color;
      color: white;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      animation: pulse 2s infinite;
    }
  }
  
  &.selected {
    background-color: lighten($info-color, 35%);
    border: 2px solid $info-color;
  }
  
  &.has-events {
    border-left: 4px solid $primary-color;
  }
}

.day-number {
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
}

.day-events {
  .event-item {
    background-color: $primary-color;
    color: white;
    padding: 2px 6px;
    margin-bottom: 2px;
    border-radius: 3px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    
    @include respond-to('mobile') {
      font-size: 0.7rem;
      padding: 1px 4px;
    }
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .event-title {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .event-time {
      font-size: 0.65rem;
      opacity: 0.9;
    }
  }
  
  .more-events {
    font-size: 0.7rem;
    color: $secondary-color;
    text-align: center;
    margin-top: 2px;
    cursor: pointer;
    padding: 2px;
    border-radius: 2px;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: $light-color;
      color: $primary-color;
    }
  }
}

.event-modal, .day-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;

  &-content {
    background-color: white;
    border-radius: 12px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }
}

.day-modal {
  &-header {
    padding: 25px 30px;
    border-bottom: 1px solid $border-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, $info-color 0%, darken($info-color, 10%) 100%);
    color: white;
    border-radius: 12px 12px 0 0;

    h3 {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 600;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.8rem;
      cursor: pointer;
      color: white;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  &-body {
    padding: 30px;
    max-height: 400px;
    overflow-y: auto;
    
    .no-events {
      text-align: center;
      color: $secondary-color;
      font-style: italic;
      padding: 40px 20px;
=======
@media (max-width: 768px) {
  .calendar-wrapper {
    padding: 20px;
    border-radius: 16px;
    
    :deep(.fc) {
      .fc-toolbar {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }
      
      .fc-toolbar-title {
        order: -1;
        margin-bottom: 8px;
      }
    }
  }
}

@media (min-width: 1200px) {
  .calendar-wrapper {
    padding: 30px;
    
    :deep(.fc) {
      .fc-daygrid-day {
        min-height: 140px;
      }
>>>>>>> 5e78e1a (cambios)
    }
  }
}

<<<<<<< HEAD
@include respond-to('mobile') {
  .calendar-header {
    padding: 15px;
    
    h2 {
      font-size: 1.3rem;
    }
  }
  
  .event-modal, .day-modal {
    padding: 10px;
    
    &-content {
      max-height: 95vh;
    }
  }
  
  .day-modal {
    &-header,
    &-body {
      padding: 20px;
=======
// Dark mode support
@media (prefers-color-scheme: dark) {
  .calendar-wrapper {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    
    :deep(.fc) {
      .fc-scrollgrid {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      }
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .calendar-wrapper,
  .calendar-wrapper :deep(*) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// High contrast support
@media (prefers-contrast: high) {
  .calendar-wrapper {
    border: 2px solid var(--color-primary);
    
    :deep(.fc) {
      .fc-event {
        border: 1px solid currentColor;
      }
    }
  }
}

// Print styles
@media print {
  .calendar-wrapper {
    box-shadow: none;
    background: white;
    padding: 10px;
    
    &::before,
    &::after {
      display: none;
    }
    
    :deep(.fc) {
      .fc-toolbar {
        display: none;
      }
      
      .fc-scrollgrid {
        box-shadow: none;
        border: 1px solid #000;
      }
>>>>>>> 5e78e1a (cambios)
    }
  }
}
</style>