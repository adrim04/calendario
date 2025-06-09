<template>
  <div class="event-card" :style="{ borderLeftColor: event.color || '#3788d8' }">
    <div class="event-header">
      <h3 class="event-title">{{ event.title }}</h3>
      <div class="event-actions">
        <button class="btn-edit" @click="$emit('edit', event)">
          Editar
        </button>
      </div>
    </div>

    <div class="event-time">
      {{ formatDate(event.start) }} - {{ formatDate(event.end) }}
    </div>

    <div class="event-description" v-if="event.description">
      {{ event.description }}
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
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
}
</script>

<style lang="scss" scoped>
.event-card {
  background-color: #f0faff; // celeste muy claro
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 50, 100, 0.1);
  padding: 12px;
  margin-bottom: 10px;
  border-left: 4px solid #a5d8ff; // celeste pastel más saturado

  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .event-title {
      margin: 0;
      font-size: 1rem;
      font-weight: bold;
      color: #336677; // azul pastel oscuro
    }

    .event-actions {
      .btn-edit {
        background: none;
        border: none;
        color: #2c94cc; // tono celeste intermedio
        cursor: pointer;
        font-size: 0.8rem;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .event-time {
    font-size: 0.8rem;
    color: #5588aa; // azul grisáceo claro
    margin-bottom: 8px;
  }

  .event-description {
    font-size: 0.9rem;
    color: #224455; // tono sobrio para buena lectura
  }
}
</style>
