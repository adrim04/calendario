<template>
  <div class="event-form-container">
    <div class="event-form">
      <h2>{{ isNewEvent ? 'Crear Evento' : 'Editar Evento' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="event-title">Título</label>
          <input 
            id="event-title" 
            v-model="formData.title" 
            type="text" 
            required
            placeholder="Título del evento"
          >
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="event-start">Fecha inicio</label>
            <input 
              id="event-start" 
              v-model="formData.startDate" 
              type="date" 
              required
            >
          </div>
          
          <div class="form-group">
            <label for="event-start-time">Hora inicio</label>
            <input 
              id="event-start-time" 
              v-model="formData.startTime" 
              type="time" 
              required
            >
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="event-end">Fecha fin</label>
            <input 
              id="event-end" 
              v-model="formData.endDate" 
              type="date" 
              required
            >
          </div>
          
          <div class="form-group">
            <label for="event-end-time">Hora fin</label>
            <input 
              id="event-end-time" 
              v-model="formData.endTime" 
              type="time" 
              required
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="event-color">Color</label>
          <input 
            id="event-color" 
            v-model="formData.color" 
            type="color"
          >
        </div>
        
        <div class="form-group">
          <label for="event-description">Descripción</label>
          <textarea 
            id="event-description" 
            v-model="formData.description" 
            rows="3"
            placeholder="Descripción del evento"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-cancel" @click="$emit('cancel')">
            Cancelar
          </button>
          <button type="button" v-if="!isNewEvent" class="btn btn-delete" @click="confirmDelete">
            Eliminar
          </button>
          <button type="submit" class="btn btn-save">
            Guardar
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
        color: '#3788d8'
      }
    }
  },
  computed: {
    isNewEvent() {
      return !this.event || !this.event.title;
    }
  },
  watch: {
    event: {
      handler(newEvent) {
        if (newEvent) {
          const start = new Date(newEvent.start);
          const end = new Date(newEvent.end);
          
          this.formData = {
            id: newEvent.id || Date.now().toString(),
            title: newEvent.title || '',
            startDate: this.formatDate(start),
            startTime: this.formatTime(start),
            endDate: this.formatDate(end),
            endTime: this.formatTime(end),
            description: newEvent.description || '',
            color: newEvent.color || '#3788d8'
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
        color: this.formData.color
      };
      
      console.log('Guardando evento:', eventData);
      this.$emit('save', eventData);
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
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    flex: 1;
    max-width: 400px;
  }
}

.event-form {
  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #2c3e50;
  }
  
  .form-group {
    margin-bottom: 15px;
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }
    
    input, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      
      &:focus {
        outline: none;
        border-color: #42b983;
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
      
      &.btn-cancel {
        background-color: #f8f9fa;
        color: #333;
        
        &:hover {
          background-color: #e2e6ea;
        }
      }
      
      &.btn-delete {
        background-color: #dc3545;
        color: white;
        
        &:hover {
          background-color: darken(#dc3545, 10%);
        }
      }
      
      &.btn-save {
        background-color: #42b983;
        color: white;
        
        &:hover {
          background-color: darken(#42b983, 10%);
        }
      }
    }
  }
}
</style>
