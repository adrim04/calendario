<template>
<<<<<<< HEAD
  <div class="event-form">
    <div class="event-form-header">
      <h3>{{ event ? 'Editar Evento' : 'Nuevo Evento' }}</h3>
      <button @click="$emit('cancel')" class="btn-close">×</button>
    </div>
    
    <form @submit.prevent="handleSubmit" class="event-form-body">
      <div class="form-group">
        <label for="event-title">Título *</label>
        <input 
          id="event-title" 
          v-model="form.title" 
          type="text" 
          class="form-control"
          :class="{ error: errors.title }"
          @input="validateField('title')"
          @blur="validateField('title')"
          placeholder="Ingresa el título del evento"
          maxlength="100"
          autocomplete="off"
        >
        <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
=======
  <div class="event-form-container" :class="themeClass">
    <div class="event-form">
      <h2>{{ isNewEvent ? 'Crear Evento' : 'Editar Evento' }}</h2>

      <!-- Indicador de estado completado -->
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
>>>>>>> 5e78e1a (cambios)
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="event-date">Fecha *</label>
          <input 
            id="event-date" 
            v-model="form.date" 
            type="date" 
            class="form-control"
            :class="{ error: errors.date }"
            @change="validateField('date')"
            :min="minDate"
          >
          <span v-if="errors.date" class="error-message">{{ errors.date }}</span>
        </div>
        
        <div class="form-group">
          <label for="event-time">Hora</label>
          <input 
            id="event-time" 
            v-model="form.time" 
            type="time" 
            class="form-control"
          >
        </div>
      </div>
      
      <div class="form-group">
        <label>Color del evento</label>
        <div class="color-picker">
          <div 
            v-for="color in colorOptions" 
            :key="color.value"
            class="color-option"
            :class="{ active: form.color === color.value }"
            :style="{ backgroundColor: color.value }"
            @click="form.color = color.value"
            :title="color.name"
          ></div>
        </div>
      </div>
      
      <div class="form-group">
        <label for="event-description">Descripción</label>
        <textarea 
          id="event-description" 
          v-model="form.description" 
          class="form-control"
          placeholder="Descripción opcional del evento"
          maxlength="500"
          rows="4"
        ></textarea>
        <small class="char-counter">{{ form.description.length }}/500</small>
      </div>
    </form>
    
    <div class="event-form-footer">
      <button @click="$emit('cancel')" type="button" class="btn btn-secondary">
        <font-awesome-icon :icon="['fas', 'times']" /> Cancelar
      </button>
      <button 
        @click="handleDelete" 
        v-if="event" 
        type="button" 
        class="btn btn-danger"
        :disabled="saving"
      >
        <font-awesome-icon :icon="['fas', 'trash']" /> Eliminar
      </button>
      <button 
        @click="handleSubmit" 
        type="button" 
        class="btn btn-primary"
        :disabled="saving || !isFormValid"
      >
        <div v-if="saving" class="loading-spinner small"></div>
        <span v-else>
          <font-awesome-icon :icon="['fas', 'save']" /> Guardar
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { themeService } from '@/services/themeService';

export default {
  name: 'EventForm',
  props: {
    event: {
      type: Object,
      default: null
    },
    selectedDate: {
      type: String,
      default: null
    }
  },
  data() {
    return {
<<<<<<< HEAD
      saving: false,
      form: {
        title: '',
        date: '',
        time: '',
        color: '#4a6fa5',
        description: ''
      },
      errors: {},
      colorOptions: [
        { name: 'Azul', value: '#4a6fa5' },
        { name: 'Verde', value: '#28a745' },
        { name: 'Rojo', value: '#dc3545' },
        { name: 'Amarillo', value: '#ffc107' },
        { name: 'Púrpura', value: '#6f42c1' },
        { name: 'Naranja', value: '#fd7e14' },
        { name: 'Turquesa', value: '#20c997' },
        { name: 'Rosa', value: '#e83e8c' }
      ]
    }
  },
  computed: {
    isFormValid() {
      return this.form.title.trim() && 
             this.form.date && 
             Object.keys(this.errors).length === 0
    },
    
    minDate() {
      return new Date().toISOString().split('T')[0]
=======
      currentTheme: 'soft',
      formData: {
        id: '',
        title: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        description: '',
        color: '#F28BA8',
        completed: false
      }
    }
  },
  computed: {
    isNewEvent() {
      return !this.event || !this.event.id;
    },
    themeClass() {
      return `theme-${this.currentTheme}`;
>>>>>>> 5e78e1a (cambios)
    }
  },
  watch: {
    event: {
      immediate: true,
      handler(newEvent) {
        if (newEvent) {
<<<<<<< HEAD
          this.form = { ...newEvent }
        } else {
          this.resetForm()
=======
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
            color: newEvent.color || this.getDefaultColor(),
            completed: newEvent.completed || false
          };
>>>>>>> 5e78e1a (cambios)
        }
      }
    },
    
    selectedDate: {
      immediate: true,
      handler(newDate) {
        if (newDate && !this.event) {
          this.form.date = newDate
        }
      }
    }
  },
  mounted() {
    this.currentTheme = themeService.getCurrentTheme();
    this.formData.color = this.getDefaultColor();
    
    this.themeWatcher = setInterval(() => {
      const newTheme = themeService.getCurrentTheme();
      if (newTheme !== this.currentTheme) {
        this.currentTheme = newTheme;
      }
    }, 100);
  },
  beforeUnmount() {
    if (this.themeWatcher) {
      clearInterval(this.themeWatcher);
    }
  },
  methods: {
<<<<<<< HEAD
    validateField(field) {
      this.$delete(this.errors, field)
      
      switch (field) {
        case 'title':
          if (!this.form.title.trim()) {
            this.$set(this.errors, 'title', 'El título es obligatorio')
          } else if (this.form.title.length > 100) {
            this.$set(this.errors, 'title', 'El título no puede exceder 100 caracteres')
          } else if (this.form.title.length < 3) {
            this.$set(this.errors, 'title', 'El título debe tener al menos 3 caracteres')
          }
          break
          
        case 'date':
          if (!this.form.date) {
            this.$set(this.errors, 'date', 'La fecha es obligatoria')
          } else if (new Date(this.form.date) < new Date().setHours(0,0,0,0)) {
            this.$set(this.errors, 'date', 'La fecha no puede ser en el pasado')
          }
          break
=======
    getDefaultColor() {
      const themeColors = {
        soft: '#F28BA8',
        coral: '#FF8A95',
        peach: '#FFAB91',
        lavender: '#CE93D8',
        mint: '#A5D6A7',
        sky: '#90CAF9'
      };
      return themeColors[this.currentTheme] || '#F28BA8';
    },
    formatDate(date) {
      if (!date) return '';
      return date.toISOString().split('T')[0];
    },
    formatTime(date) {
      if (!date) return '';
      return date.toTimeString().slice(0, 5);
    },
    handleSubmit() {
      const startDateTime = new Date(`${this.formData.startDate}T${this.formData.startTime}`);
      const endDateTime = new Date(`${this.formData.endDate}T${this.formData.endTime}`);

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

      this.$emit('save', eventData);
    },
    toggleComplete() {
      this.formData.completed = !this.formData.completed;
      if (this.formData.id) {
        this.$emit('toggle-complete', this.formData.id, this.formData.completed);
>>>>>>> 5e78e1a (cambios)
      }
    },
    
    validateForm() {
      this.errors = {}
      this.validateField('title')
      this.validateField('date')
      return Object.keys(this.errors).length === 0
    },
    
    async handleSubmit() {
      if (!this.validateForm()) {
        this.showFirstError()
        return
      }
      
      this.saving = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        this.$emit('save', { ...this.form })
      } catch (error) {
        console.error('Error al guardar:', error)
      } finally {
        this.saving = false
      }
    },
    
    handleDelete() {
      this.$emit('delete', this.event.id)
    },
    
    showFirstError() {
      const firstErrorField = Object.keys(this.errors)[0]
      if (firstErrorField) {
        const element = document.getElementById(`event-${firstErrorField}`)
        if (element) {
          element.focus()
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    },
    
    resetForm() {
      this.form = {
        title: '',
        date: this.selectedDate || new Date().toISOString().split('T')[0],
        time: '',
        color: '#4a6fa5',
        description: ''
      }
      this.errors = {}
    }
  }
}
</script>

<style lang="scss" scoped>
<<<<<<< HEAD
@import '../assets/styles/main.scss';
=======
.event-form-container {
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: fadeIn 0.6s ease-out;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  @media (min-width: 768px) {
    flex: 1;
    max-width: 420px;
  }
}
>>>>>>> 5e78e1a (cambios)

// Temas específicos
.theme-soft {
  background: linear-gradient(135deg, #FFF9F6, #FADADD);
  
  .event-form h2 { color: #E7627D; }
  
  .form-group {
    label { color: #E7627D; }
    
    input, textarea {
      background: #FFFFFF;
      color: #E7627D;
      border-color: #FFB5B5;
      
      &:focus { border-color: #F28BA8; }
      &::placeholder { color: #A6C8A0; }
      &.completed-input { background: #FFF9F6; color: #A6C8A0; }
    }
  }
  
  .completion-status {
    background: #FFFFFF;
    border-color: #FFB5B5;
    
    .status-text, .status-icon { color: #A6C8A0; }
    &.completed .status-text, &.completed .status-icon { color: #F28BA8; }
    
    .btn-toggle-complete {
      background: #FFFFFF;
      color: #A6C8A0;
      border-color: #A6C8A0;
      
      &:hover:not(:disabled) {
        background: #A6C8A0;
        color: #FFFFFF;
      }
      
      &.completed {
        color: #F28BA8;
        border-color: #F28BA8;
        
        &:hover:not(:disabled) {
          background: #F28BA8;
          color: #FFFFFF;
        }
      }
    }
  }
  
  .btn {
    &.btn-cancel {
      background: #FFFFFF;
      color: #A6C8A0;
      border-color: #FFB5B5;
      
      &:hover:not(:disabled) {
        background: #FFB5B5;
        color: #E7627D;
      }
    }
    
    &.btn-save {
      background: linear-gradient(135deg, #F28BA8, #FADADD);
      color: #FFFFFF;
      
      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #FADADD, #F28BA8);
      }
    }
  }
}

.theme-coral {
  background: linear-gradient(135deg, #FFF8F6, #FFAAA5);
  
  .event-form h2 { color: #2D3748; }
  
  .form-group {
    label { color: #2D3748; }
    
    input, textarea {
      background: #FFFFFF;
      color: #2D3748;
      border-color: #FFD3A5;
      
      &:focus { border-color: #FF8A95; }
      &::placeholder { color: #718096; }
      &.completed-input { background: #FFF8F6; color: #718096; }
    }
  }
  
  .btn.btn-save {
    background: linear-gradient(135deg, #FF8A95, #FFAAA5);
    color: #FFFFFF;
  }
}

.theme-peach {
  background: linear-gradient(135deg, #FFF9F5, #FFCC94);
  
  .event-form h2 { color: #37474F; }
  
  .form-group {
    label { color: #37474F; }
    
    input, textarea {
      background: #FFFFFF;
      color: #37474F;
      border-color: #FFE082;
      
      &:focus { border-color: #FFAB91; }
      &::placeholder { color: #78909C; }
      &.completed-input { background: #FFF9F5; color: #78909C; }
    }
  }
  
  .btn.btn-save {
    background: linear-gradient(135deg, #FFAB91, #FFCC94);
    color: #37474F;
  }
}

.theme-lavender {
  background: linear-gradient(135deg, #FAF5FF, #E1BEE7);
  
  .event-form h2 { color: #4A5568; }
  
  .form-group {
    label { color: #4A5568; }
    
    input, textarea {
      background: #FFFFFF;
      color: #4A5568;
      border-color: #F8BBD9;
      
      &:focus { border-color: #CE93D8; }
      &::placeholder { color: #A0AEC0; }
      &.completed-input { background: #FAF5FF; color: #A0AEC0; }
    }
  }
  
  .btn.btn-save {
    background: linear-gradient(135deg, #CE93D8, #E1BEE7);
    color: #FFFFFF;
  }
}

.theme-mint {
  background: linear-gradient(135deg, #F1F8E9, #C8E6C9);
  
  .event-form h2 { color: #2E7D32; }
  
  .form-group {
    label { color: #2E7D32; }
    
    input, textarea {
      background: #FFFFFF;
      color: #2E7D32;
      border-color: #DCEDC8;
      
      &:focus { border-color: #A5D6A7; }
      &::placeholder { color: #66BB6A; }
      &.completed-input { background: #F1F8E9; color: #66BB6A; }
    }
  }
  
  .btn.btn-save {
    background: linear-gradient(135deg, #A5D6A7, #C8E6C9);
    color: #2E7D32;
  }
}

.theme-sky {
  background: linear-gradient(135deg, #F3F8FF, #BBDEFB);
  
  .event-form h2 { color: #1565C0; }
  
  .form-group {
    label { color: #1565C0; }
    
    input, textarea {
      background: #FFFFFF;
      color: #1565C0;
      border-color: #E3F2FD;
      
      &:focus { border-color: #90CAF9; }
      &::placeholder { color: #42A5F5; }
      &.completed-input { background: #F3F8FF; color: #42A5F5; }
    }
  }
  
  .btn.btn-save {
    background: linear-gradient(135deg, #90CAF9, #BBDEFB);
    color: #1565C0;
  }
}

// Estilos comunes
.event-form {
<<<<<<< HEAD
  &-header {
    padding: 25px 30px;
    border-bottom: 1px solid $border-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, $primary-color 0%, darken($primary-color, 10%) 100%);
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
        transform: rotate(90deg);
=======
  h2 {
    margin-top: 0;
    margin-bottom: 24px;
    font-size: 1.75rem;
    font-weight: 700;
    text-align: center;
  }

  .completion-status {
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    border: 2px solid;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    
    .status-indicator {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      .status-icon {
        font-size: 1.4rem;
        margin-right: 10px;
      }

      .status-text {
        font-weight: 600;
        font-size: 1.1rem;
      }
    }

    .btn-toggle-complete {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }

  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      font-size: 0.95rem;
    }

    input, textarea {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      &:focus {
        outline: none;
        transform: translateY(-1px);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }

      &.completed-input {
        text-decoration: line-through;
        opacity: 0.8;
      }
    }

    textarea {
      resize: vertical;
      min-height: 80px;
    }

    input[type="color"] {
      height: 50px;
      cursor: pointer;
    }
  }

  .form-row {
    display: flex;
    gap: 16px;

    .form-group { flex: 1; }

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 0;
    }
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 32px;
    flex-wrap: wrap;

    .btn {
      padding: 14px 24px;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      flex: 1;
      min-width: 100px;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
>>>>>>> 5e78e1a (cambios)
      }
    }
  }

<<<<<<< HEAD
  &-body {
    padding: 30px;
    
    @include respond-to('mobile') {
      padding: 20px;
    }
  }

  &-footer {
    padding: 20px 30px;
    border-top: 1px solid $border-color;
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    background-color: $light-color;
    border-radius: 0 0 12px 12px;
    
    @include respond-to('mobile') {
      padding: 15px 20px;
      flex-wrap: wrap;
      
      .btn {
        flex: 1;
        min-width: 120px;
=======
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }

      &.btn-delete {
        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
        color: white;

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #ff5252, #e53935);
        }
>>>>>>> 5e78e1a (cambios)
      }
    }

    @media (max-width: 480px) {
      flex-direction: column;
      .btn { flex: none; }
    }
  }
}

<<<<<<< HEAD
// Animaciones para errores
.form-control.error {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

// Mejoras visuales para el formulario
.form-group {
  position: relative;
  
  .form-control {
    &:focus {
      transform: translateY(-1px);
    }
    
    &.error {
      border-color: $danger-color;
      box-shadow: 0 0 0 3px rgba($danger-color, 0.1);
    }
  }
  
  .error-message {
    animation: fadeIn 0.3s ease-out;
  }
}

.color-picker {
  .color-option {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0;
      height: 0;
      background-color: white;
      border-radius: 50%;
      transition: all 0.3s ease;
    }
    
    &.active::after {
      width: 12px;
      height: 12px;
=======
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .event-form-container {
    padding: 20px;
    margin: 10px;
  }
  
  .event-form h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .event-form-container {
    padding: 16px;
  }
  
  .completion-status {
    padding: 16px;
  }
  
  .form-group {
    margin-bottom: 16px;
    
    input, textarea {
      padding: 10px 14px;
>>>>>>> 5e78e1a (cambios)
    }
  }
}
</style>