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
import { ref, computed, onMounted } from 'vue'
import EventForm from './EventForm.vue'
import EventCard from './EventCard.vue'

export default {
  name: 'CalendarView',
  components: {
    EventForm,
    EventCard
  },
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/main.scss';

.calendar-wrapper {
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
    }
  }
}

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
    }
  }
}

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
    }
  }
}
</style>