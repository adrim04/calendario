<template>
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
    }
  },
  watch: {
    event: {
      immediate: true,
      handler(newEvent) {
        if (newEvent) {
          this.form = { ...newEvent }
        } else {
          this.resetForm()
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
  methods: {
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
@import '../assets/styles/main.scss';

.event-form {
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
      }
    }
  }

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
      }
    }
  }
}

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
    }
  }
}
</style>