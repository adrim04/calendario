<template>
  <div class="event-card fade-in" :style="{ borderLeftColor: event.color }">
    <div class="event-card-header">
      <h3 class="event-title">{{ event.title }}</h3>
      <div class="event-actions">
        <button @click="$emit('edit', event)" class="btn-icon" title="Editar evento">
          <font-awesome-icon :icon="['fas', 'edit']" />
        </button>
        <button @click="$emit('delete', event)" class="btn-icon btn-danger" title="Eliminar evento">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </button>
      </div>
    </div>
    
    <div class="event-details">
      <div class="event-time">
        <font-awesome-icon :icon="['fas', 'clock']" />
        <span>{{ formatDate(event.date) }}</span>
        <span v-if="event.time" class="time">{{ event.time }}</span>
      </div>
      
      <div v-if="event.description" class="event-description">
        <font-awesome-icon :icon="['fas', 'align-left']" />
        <p>{{ event.description }}</p>
      </div>
    </div>
    
    <div class="event-footer">
      <div class="event-color" :style="{ backgroundColor: event.color }"></div>
      <span class="event-id">#{{ event.id }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventCard',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      
      const date = new Date(dateStr);
      const options = { 
        weekday: 'long',
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
      };
      
      return date.toLocaleDateString('es-ES', options);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/main.scss';

.event-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 15px;
  border-left: 4px solid $primary-color;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, var(--event-color, #{$primary-color}) 50%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    
    &::before {
      opacity: 1;
    }
  }
  
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
  }
  
  .event-title {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: $dark-color;
    line-height: 1.3;
    flex: 1;
    margin-right: 15px;
  }
  
  .event-actions {
    display: flex;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover .event-actions {
    opacity: 1;
  }
  
  .event-details {
    margin-bottom: 15px;
  }
  
  .event-time {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: $secondary-color;
    margin-bottom: 10px;
    
    svg {
      color: $primary-color;
    }
    
    .time {
      background-color: $light-color;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 500;
      color: $primary-color;
    }
  }
  
  .event-description {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    
    svg {
      color: $secondary-color;
      margin-top: 2px;
      flex-shrink: 0;
    }
    
    p {
      margin: 0;
      font-size: 0.95rem;
      color: $dark-color;
      line-height: 1.4;
    }
  }
  
  .event-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 15px;
    border-top: 1px solid $border-color;
  }
  
  .event-color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .event-id {
    font-size: 0.8rem;
    color: $secondary-color;
    font-family: 'Courier New', monospace;
  }
  
  .btn-icon {
    background: none;
    border: none;
    color: $secondary-color;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all 0.3s ease;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background-color: $light-color;
      color: $primary-color;
      transform: scale(1.1);
    }
    
    &.btn-danger:hover {
      background-color: lighten($danger-color, 40%);
      color: $danger-color;
    }
  }
}

// Responsive
@include respond-to('mobile') {
  .event-card {
    padding: 15px;
    
    &-header {
      flex-direction: column;
      gap: 10px;
    }
    
    .event-actions {
      opacity: 1;
      align-self: flex-end;
    }
    
    .event-title {
      margin-right: 0;
    }
  }
}
</style>
