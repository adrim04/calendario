<template>
  <div class="calendar-wrapper">
    <FullCalendar ref="fullCalendar" :options="calendarOptions" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'

export default {
  name: 'AppCalendar',
  components: {
    FullCalendar
  },
  props: {
    events: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
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
        slotEventOverlap: false, // Evitar superposición de eventos
        forceEventDuration: true, // Forzar duración de eventos
        slotMinTime: '00:00:00',
        slotMaxTime: '24:00:00',
        allDaySlot: false, // Quitar la fila "Todo el día"
        eventTimeFormat: { // Formato de hora uniforme
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }
      }
    }
  },
  mounted() {
    // Inicializar eventos al montar el componente
    this.rebuildEvents(this.events);
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
    rebuildEvents(events) {
      if (this.$refs.fullCalendar) {
        const calendarApi = this.$refs.fullCalendar.getApi();

        // Limpiar todos los eventos existentes
        calendarApi.removeAllEvents();

        // Asegurarse de que los eventos tengan el formato correcto y sean únicos
        const uniqueEvents = this.removeDuplicateEvents(events);

        const formattedEvents = uniqueEvents.map(event => {
          // Determinar el estilo del evento basado en si está completado
          let eventColor = event.color;
          let eventTitle = event.title;
          let textColor = '#ffffff';

          if (event.completed) {
            // Si está completado, usar un color más tenue y tachar el texto
            eventColor = this.darkenColor(event.color, 0.5);
            eventTitle = `✓ ${event.title}`;
            textColor = '#888888';
          }

          return {
            id: event.id,
            title: eventTitle,
            start: event.start,
            end: event.end,
            backgroundColor: eventColor,
            borderColor: eventColor,
            textColor: textColor,
            classNames: event.completed ? ['completed-event'] : [],
            extendedProps: {
              description: event.description,
              completed: event.completed
            }
          };
        });

        // Añadir eventos uno por uno para evitar problemas
        formattedEvents.forEach(event => {
          calendarApi.addEvent(event);
        });
      }
    },
    removeDuplicateEvents(events) {
      // Eliminar eventos duplicados basados en ID
      const uniqueIds = new Set();
      return events.filter(event => {
        if (uniqueIds.has(event.id)) {
          return false;
        }
        uniqueIds.add(event.id);
        return true;
      });
    },
    // NUEVO: Función para oscurecer un color
    darkenColor(color, factor) {
      // Convertir color hex a RGB
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      // Aplicar factor de oscurecimiento
      const newR = Math.floor(r * factor);
      const newG = Math.floor(g * factor);
      const newB = Math.floor(b * factor);

      // Convertir de vuelta a hex
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-wrapper {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;

  :deep(.fc) {
    .fc-button-primary {
      background-color: #42b983;
      border-color: #42b983;

      &:hover {
        background-color: darken(#42b983, 10%);
        border-color: darken(#42b983, 10%);
      }

      &:disabled {
        background-color: lighten(#42b983, 20%);
        border-color: lighten(#42b983, 20%);
      }
    }

    .fc-event {
      cursor: pointer;
      border-radius: 3px;
      margin: 1px 0;

      &:hover {
        opacity: 0.9;
      }
    }

    // NUEVO: Estilos para eventos completados
    .completed-event {
      .fc-event-title {
        text-decoration: line-through;
        opacity: 0.7;
      }
    }

    .fc-toolbar-title {
      font-size: 1.5rem;
      color: #2c3e50;
    }

    /* Mejorar la visualización de eventos en vista de día */
    .fc-timegrid-event {
      border-radius: 3px;
      padding: 2px 4px;

      .fc-event-time,
      .fc-event-title {
        padding: 0 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    /* Mejorar la visualización de la cuadrícula */
    .fc-timegrid-slot,
    .fc-timegrid-slot-lane {
      height: 40px !important;
      /* Altura fija para las celdas de tiempo */
    }

    /* Mejorar la visualización de las horas */
    .fc-timegrid-axis {
      padding-right: 8px;
      text-align: right;
    }
  }
}
</style>
