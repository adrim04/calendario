<template>
  <div class="theme-toggle-container">
    <!-- Botón flotante -->
    <button 
      class="theme-toggle-btn"
      @click="toggleCustomizer"
      :class="{ active: showCustomizer }"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
      </svg>
    </button>

    <!-- Panel del customizador -->
    <div 
      class="customizer-overlay"
      v-if="showCustomizer"
      @click="closeCustomizer"
    >
      <div class="customizer-panel" @click.stop>
        <ThemeCustomizer 
          @close="closeCustomizer"
          @theme-changed="onThemeChanged"
          @font-changed="onFontChanged"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ThemeCustomizer from './ThemeCustomizer.vue';

export default {
  name: 'ThemeToggle',
  components: {
    ThemeCustomizer
  },
  data() {
    return {
      showCustomizer: false
    };
  },
  methods: {
    toggleCustomizer() {
      this.showCustomizer = !this.showCustomizer;
    },
    closeCustomizer() {
      this.showCustomizer = false;
    },
    onThemeChanged(theme) {
      this.$emit('theme-changed', theme);
    },
    onFontChanged(font) {
      this.$emit('font-changed', font);
    }
  }
};
</script>

<style scoped>
.theme-toggle-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.theme-toggle-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-primary, #3498db);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.theme-toggle-btn.active {
  transform: rotate(180deg);
  background: var(--color-accent, #e74c3c);
}

.customizer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

.customizer-panel {
  animation: slideIn 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
  margin: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .theme-toggle-btn {
    width: 48px;
    height: 48px;
    bottom: 16px;
    right: 16px;
  }
  
  .customizer-panel {
    margin: 10px;
    max-width: calc(100vw - 20px);
  }
}
</style>