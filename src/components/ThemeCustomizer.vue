<template>

  <div class="theme-customizer">

    <div class="customizer-header">

      <h3>Personalización</h3>

      <button @click="closeCustomizer" class="close-btn">

        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">

          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>

        </svg>

      </button>

    </div>



    <div class="customizer-section">

      <h4>Temas de color</h4>

      <div class="theme-grid">

        <div 

          v-for="theme in themes" 

          :key="theme.id"

          class="theme-card"

          :class="{ active: currentTheme === theme.id }"

          @click="selectTheme(theme.id)"

        >

          <div class="theme-preview">

            <div class="color-gradient" 

                 :style="{ 

                   background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 50%, ${theme.colors.accent} 100%)`

                 }">

            </div>

          </div>

          <span class="theme-name">{{ theme.name }}</span>

        </div>

      </div>

    </div>



    <div class="customizer-section">

      <h4>Tipografía</h4>

      <div class="font-list">

        <div 

          v-for="font in fonts" 

          :key="font.id"

          class="font-option"

          :class="{ active: currentFont === font.id }"

          @click="selectFont(font.id)"

        >

          <span class="font-sample" :style="{ fontFamily: font.fontFamily }">

            {{ font.name }}

          </span>

          <span class="font-preview" :style="{ fontFamily: font.fontFamily }">

            Aa

          </span>

        </div>

      </div>

    </div>



    <div class="customizer-section">

      <h4>Vista previa</h4>

      <div class="preview-card">


        <div class="preview-calendar">

          <div class="calendar-grid">

            <div class="day-header">L</div>

            <div class="day-header">M</div>

            <div class="day-header">X</div>

            <div class="day-header">J</div>

            <div class="day-header">V</div>

            <div class="day-header">S</div>

            <div class="day-header">D</div>

            

            <div class="day-cell"></div>

            <div class="day-cell"></div>

            <div class="day-cell"></div>

            <div class="day-cell">1</div>

            <div class="day-cell">2</div>

            <div class="day-cell">3</div>

            <div class="day-cell">4</div>

            

            <div class="day-cell">5</div>

            <div class="day-cell">6</div>

            <div class="day-cell">7</div>

            <div class="day-cell">8</div>

            <div class="day-cell">9</div>

            <div class="day-cell">10</div>

            <div class="day-cell">11</div>

            

            <div class="day-cell">12</div>

            <div class="day-cell">13</div>

            <div class="day-cell">14</div>

            <div class="day-cell active-day">15</div>

            <div class="day-cell">16</div>

            <div class="day-cell">17</div>

            <div class="day-cell">18</div>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>



<script>

import { themeService } from '../services/themeService.js';



export default {

  name: 'ThemeCustomizer',

  data() {

    return {

      themes: [],

      fonts: [],

      currentTheme: 'soft',

      currentFont: 'inter'

    };

  },

  mounted() {

    this.loadThemes();

    this.loadFonts();

    this.currentTheme = themeService.getCurrentTheme();

    this.currentFont = themeService.getCurrentFont();

  },

  methods: {

    closeCustomizer() {

      this.$emit('close');

    },

    loadThemes() {

      this.themes = themeService.getThemes();

    },

    loadFonts() {

      this.fonts = themeService.getFonts();

    },

    selectTheme(themeId) {

      this.currentTheme = themeId;

      themeService.applyTheme(themeId);

      this.$emit('theme-changed', themeId);

    },

    selectFont(fontId) {

      this.currentFont = fontId;

      themeService.setFont(fontId);

      this.$emit('font-changed', fontId);

    }

  }

};

</script>



<style scoped>

.theme-customizer {

  width: 100%;

  max-width: 380px;

  background: var(--color-surface);

  border-radius: 20px;

  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

  overflow: hidden;

  font-family: var(--font-family);

  backdrop-filter: blur(10px);

}



.customizer-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 24px 24px 16px 24px;

  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);

  color: white;

}



.customizer-header h3 {

  margin: 0;

  font-size: 20px;

  font-weight: 600;

  letter-spacing: -0.5px;

}



.close-btn {

  background: rgba(255, 255, 255, 0.2);

  border: none;

  color: white;

  cursor: pointer;

  padding: 8px;

  border-radius: 50%;

  transition: all 0.2s ease;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 32px;

  height: 32px;

}



.close-btn:hover {

  background: rgba(255, 255, 255, 0.3);

  transform: scale(1.1);

}



.customizer-section {

  padding: 20px 24px;

  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

}



.customizer-section:last-child {

  border-bottom: none;

}



.customizer-section h4 {

  margin: 0 0 16px 0;

  color: var(--color-text);

  font-size: 14px;

  font-weight: 600;

  text-transform: uppercase;

  letter-spacing: 1px;

  opacity: 0.8;

}



.theme-grid {

  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 12px;

}



.theme-card {

  padding: 16px 12px 12px 12px;

  border: 2px solid transparent;

  border-radius: 12px;

  cursor: pointer;

  transition: all 0.3s ease;

  text-align: center;

  background: var(--color-background);

  position: relative;

}



.theme-card:hover {

  border-color: var(--color-primary);

  transform: translateY(-2px);

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

}



.theme-card.active {

  border-color: var(--color-primary);

  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);

  color: white;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

}



.theme-preview {

  margin-bottom: 8px;

  display: flex;

  justify-content: center;

}



.color-gradient {

  width: 40px;

  height: 24px;

  border-radius: 20px;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

}



.theme-name {

  font-size: 12px;

  font-weight: 500;

  letter-spacing: 0.5px;

}



.font-list {

  display: flex;

  flex-direction: column;

  gap: 8px;

}



.font-option {

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 12px 16px;

  border: 2px solid transparent;

  border-radius: 12px;

  cursor: pointer;

  transition: all 0.3s ease;

  background: var(--color-background);

}



.font-option:hover {

  border-color: var(--color-primary);

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

}



.font-option.active {

  border-color: var(--color-primary);

  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);

  color: white;

}



.font-sample {

  font-size: 14px;

  font-weight: 500;

}



.font-preview {

  font-size: 18px;

  font-weight: 600;

  opacity: 0.7;

}



.preview-card {

  background: var(--color-background);

  border-radius: 12px;

  padding: 16px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

}



.preview-header {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 12px;

}



.preview-header h5 {

  margin: 0;

  color: var(--color-text);

  font-size: 16px;

  font-weight: 600;

}



.preview-date {

  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);

  color: white;

  padding: 4px 12px;

  border-radius: 20px;

  font-size: 12px;

  font-weight: 500;

}



.preview-calendar {

  margin-top: 12px;

}



.calendar-grid {

  display: grid;

  grid-template-columns: repeat(7, 1fr);

  gap: 4px;

  font-size: 12px;

}



.day-header {

  text-align: center;

  padding: 8px 4px;

  font-weight: 600;

  color: var(--color-textSecondary);

  font-size: 10px;

  text-transform: uppercase;

  letter-spacing: 0.5px;

}



.day-cell {

  aspect-ratio: 1;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 8px;

  cursor: pointer;

  transition: all 0.2s ease;

  color: var(--color-text);

  font-weight: 500;

}



.day-cell:hover {

  background: var(--color-accent);

}



.day-cell.active-day {

  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);

  color: white;

  font-weight: 600;

}



@media (max-width: 480px) {

  .theme-customizer {

    max-width: calc(100vw - 20px);

    margin: 10px;

  }

  

  .customizer-section {

    padding: 16px 20px;

  }

  

  .theme-grid {

    grid-template-columns: 1fr;

  }

}

</style>