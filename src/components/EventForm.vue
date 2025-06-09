<template>
  <div class="event-form-container">
    <div class="event-form">
      <h2>{{ isNewEvent ? 'Crear Evento' : 'Editar Evento' }}</h2>

      <!-- NUEVO: Indicador de estado completado -->
      <div v-if="!isNewEvent" class="completion-status">
        <div class="status-indicator" :class="{ 'completed': formData.completed }">
          <span class="status-icon">{{ formData.completed ? '✓' : '○' }}</span>
          <span class="status-text">
            {{ formData.completed ? 'Completado' : 'Pendiente' }}
          </span>
        </div>
        <button type="button" class="btn btn-toggle-complete" @click="toggleComplete" :disabled="loading"
          :class="{ 'completed': formData.completed }">
          {{ formData.completed ? 'Marcar como pendiente' : 'Marcar como completado' }}
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="event-title">Título</label>
          <input id="event-title" v-model="formData.title" type="text" required placeholder="Título del evento"
            :disabled="loading" :class="{ 'completed-input': formData.completed }">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="event-start">Fecha inicio</label>
            <input id="event-start" v-model="formData.startDate" type="date" required :disabled="loading">
          </div>

          <div class="form-group">
            <label for="event-start-time">Hora inicio</label>
            <input id="event-start-time" v-model="formData.startTime" type="time" required :disabled="loading">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="event-end">Fecha fin</label>
            <input id="event-end" v-model="formData.endDate" type="date" required :disabled="loading">
          </div>

          <div class="form-group">
            <label for="event-end-time">Hora fin</label>
            <input id="event-end-time" v-model="formData.endTime" type="time" required :disabled="loading">
          </div>
        </div>

        <div class="form-group">
          <label for="event-color">Color</label>
          <input id="event-color" v-model="formData.color" type="color" :disabled="loading">
        </div>

        <div class="form-group">
          <label for="event-description">Descripción</label>
          <textarea id="event-description" v-model="formData.description" rows="3" placeholder="Descripción del evento"
            :disabled="loading" :class="{ 'completed-input': formData.completed }"></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-cancel" @click="$emit('cancel')" :disabled="loading">
            Cancelar
          </button>
          <button type="button" v-if="!isNewEvent" class="btn btn-delete" @click="confirmDelete" :disabled="loading">
            Eliminar
          </button>
          <button type="submit" class="btn btn-save" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventForm',
  props: {
    event: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        id: '',
        title: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        description: '',
        color: '#3788d8',
        completed: false
      }
    }
  },
  computed: {
    isNewEvent() {
      return !this.event || !this.event.id;
    }
  },
  watch: {
    event: {
      handler(newEvent) {
        if (newEvent) {
          const start = new Date(newEvent.start);
          const end = new Date(newEvent.end);

          this.formData = {
            id: newEvent.id || '',
            title: newEvent.title || '',
            startDate: this.formatDate(start),
            startTime: this.formatTime(start),
            endDate: this.formatDate(end),
            endTime: this.formatTime(end),
            description: newEvent.description || '',
            color: newEvent.color || '#3788d8',
            completed: newEvent.completed || false
          };
        }
      },
      immediate: true
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      return date.toISOString().split('T')[0];
    },
    formatTime(date) {
      if (!date) return '';
      return date.toTimeString().slice(0, 5);
    },
    handleSubmit() {
      // Combinar fecha y hora
      const startDateTime = new Date(`${this.formData.startDate}T${this.formData.startTime}`);
      const endDateTime = new Date(`${this.formData.endDate}T${this.formData.endTime}`);

      // Validar que la fecha de fin sea después de la fecha de inicio
      if (endDateTime <= startDateTime) {
        alert('La fecha de fin debe ser posterior a la fecha de inicio');
        return;
      }

      const eventData = {
        id: this.formData.id,
        title: this.formData.title,
        start: startDateTime,
        end: endDateTime,
        description: this.formData.description,
        color: this.formData.color,
        completed: this.formData.completed
      };

      console.log('Guardando evento:', eventData);
      this.$emit('save', eventData);
    },
    // NUEVO: Función para cambiar estado de completado
    toggleComplete() {
      this.formData.completed = !this.formData.completed;
      if (this.formData.id) {
        // Si es un evento existente, actualizar inmediatamente
        this.$emit('toggle-complete', this.formData.id, this.formData.completed);
      }
    },
    confirmDelete() {
      if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
        this.$emit('delete', this.formData.id);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.event-form-container {
  background-color: #e8f6ff; // celeste muy claro
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 50, 100, 0.1);

  @media (min-width: 768px) {
    flex: 1;
    max-width: 400px;
  }
}

.event-form {
  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #336677; // azul pastel oscuro
  }

  .completion-status {
    background-color: #f0faff;
    border-radius: 6px;
    padding: 15px;
    margin-bottom: 20px;
    border: 2px solid #cce7f6;

    .status-indicator {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .status-icon {
        font-size: 1.2rem;
        margin-right: 8px;
        color: #6c8da5; // azul grisáceo
      }

      .status-text {
        font-weight: bold;
        color: #6c8da5;
      }

      &.completed {
        .status-icon {
          color: #4cb495; // verde pastel (suave para completado)
        }

        .status-text {
          color: #4cb495;
        }
      }
    }

    .btn-toggle-complete {
      width: 100%;
      padding: 8px 12px;
      border: 2px solid #6c8da5;
      background-color: white;
      color: #6c8da5;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background-color: #6c8da5;
        color: white;
      }

      &.completed {
        border-color: #4cb495;
        color: #4cb495;

        &:hover:not(:disabled) {
          background-color: #4cb495;
          color: white;
        }
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }

  .form-group {
    margin-bottom: 15px;

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #336677;
    }

    input,
    textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #aad8f0;
      border-radius: 4px;
      font-size: 1rem;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: #7bcfff;
      }

      &:disabled {
        background-color: #f0faff;
        cursor: not-allowed;
      }

      &.completed-input {
        background-color: #f0faff;
        color: #6c8da5;
        text-decoration: line-through;
      }
    }
  }

  .form-row {
    display: flex;
    gap: 10px;

    .form-group {
      flex: 1;
    }
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    .btn {
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      &.btn-cancel {
        background-color: #f0faff;
        color: #336677;

        &:hover:not(:disabled) {
          background-color: #dbeefd;
        }
      }

      &.btn-delete {
        background-color: #ee6c74;
        color: white;

        &:hover:not(:disabled) {
          background-color: darken(#ee6c74, 10%);
        }
      }

      &.btn-save {
        background-color: #7bcfff; // celeste pastel más saturado
        color: white;

        &:hover:not(:disabled) {
          background-color: darken(#7bcfff, 10%);
        }
      }
    }
  }
}
</style>
