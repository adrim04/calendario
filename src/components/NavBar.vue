<template>
  <header class="navbar slide-in">
    <div class="navbar-container">
<<<<<<< HEAD
      <div class="navbar-logo">
        <h1>
          <font-awesome-icon :icon="['fas', 'calendar-alt']" />
          MyScheduler
        </h1>
=======
      
      <!-- Título del calendario -->
      <div class="navbar-calendar-title">
        <h1>Mi Calendario</h1>
      </div>

      <div class="navbar-actions">
        <!-- Botón para personalizar temas -->
        <button @click="$emit('toggle-customizer')" class="theme-toggle-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
          </svg>
          <span class="btn-text">Personalizar</span>
        </button>
        
        <button class="btn btn-primary" @click="$emit('create-event')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          <span class="btn-text">Nuevo Evento</span>
        </button>
>>>>>>> 5e78e1a (cambios)
      </div>
      
      <!-- Mobile menu button -->
      <button 
        class="mobile-menu-btn"
        @click="toggleMobileMenu"
        :class="{ active: mobileMenuOpen }"
        aria-label="Menú de navegación"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <nav class="navbar-menu" :class="{ open: mobileMenuOpen }">
        <ul>
          <li>
            <a 
              href="#" 
              :class="{ active: activeItem === 'calendario' }"
              @click="setActive('calendario')"
            >
              <font-awesome-icon :icon="['fas', 'calendar']" />
              Calendario
            </a>
          </li>
          <li>
            <a 
              href="#" 
              :class="{ active: activeItem === 'eventos' }"
              @click="setActive('eventos')"
            >
              <font-awesome-icon :icon="['fas', 'list']" />
              Eventos
            </a>
          </li>
          <li>
            <a 
              href="#" 
              :class="{ active: activeItem === 'perfil' }"
              @click="setActive('perfil')"
            >
              <font-awesome-icon :icon="['fas', 'user']" />
              Perfil
            </a>
          </li>
        </ul>
      </nav>
    </div>
    
    <!-- Overlay para cerrar menú móvil -->
    <div 
      v-if="mobileMenuOpen" 
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>
  </header>
</template>

<script>
export default {
  name: 'NavBar',
<<<<<<< HEAD
  data() {
    return {
      mobileMenuOpen: false,
      activeItem: 'calendario'
    }
  },
  methods: {
    setActive(item) {
      this.activeItem = item;
      this.closeMobileMenu();
    },
    
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    
    closeMobileMenu() {
      this.mobileMenuOpen = false;
    }
  },
  
  mounted() {
    // Cerrar menú móvil al redimensionar ventana
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
      }
    });
  }
=======
  emits: [
    'create-event',
    'toggle-customizer'
  ]
>>>>>>> 5e78e1a (cambios)
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/main.scss';

.navbar {
<<<<<<< HEAD
  background: linear-gradient(135deg, $primary-color 0%, darken($primary-color, 15%) 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  &-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
=======
  // Usar variables CSS del tema en lugar de colores fijos
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: var(--color-surface);
  font-family: var(--font-family);
  padding: 15px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  
  // Efecto de brillo suave
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: shimmer 3s infinite;
  }
  
  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 15px;
      align-items: stretch;
    }
  }
  
  

  .navbar-calendar-title {
    flex: 1;
    margin-left: 20px;
    
    h1 {
      margin: 0;
      font-size: 2rem;
      color: var(--color-surface);
      font-weight: bold;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      font-family: var(--font-family);
      
      &:hover {
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transform: scale(1.02);
      }
      
      @media (max-width: 768px) {
        font-size: 1.5rem;
      }
    }
    
    @media (max-width: 768px) {
      order: 2;
    }
  }

  .navbar-actions {
>>>>>>> 5e78e1a (cambios)
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    
<<<<<<< HEAD
    @include respond-to('tablet') {
      padding: 0 15px;
    }
  }

  &-logo {
    h1 {
      font-size: 1.8rem;
      margin: 0;
      padding: 20px 0;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.3s ease;
      
      @include respond-to('tablet') {
        font-size: 1.5rem;
        padding: 15px 0;
      }
      
      @include respond-to('mobile') {
        font-size: 1.3rem;
      }
      
      svg {
        color: lighten($primary-color, 30%);
        animation: pulse 3s infinite;
      }
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }

  &-menu {
    @include respond-to('tablet') {
      position: fixed;
      top: 0;
      right: -100%;
      width: 280px;
      height: 100vh;
      background: linear-gradient(180deg, $primary-color 0%, darken($primary-color, 20%) 100%);
      transition: right 0.3s ease;
      padding-top: 80px;
      box-shadow: -5px 0 20px rgba(0, 0, 0, 0.2);
      
      &.open {
        right: 0;
      }
    }

    ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      
      @include respond-to('tablet') {
        flex-direction: column;
        padding: 20px 0;
      }

      li {
        margin-left: 30px;
        
        @include respond-to('tablet') {
          margin: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          
          &:last-child {
            border-bottom: none;
          }
        }

        a {
          color: white;
          text-decoration: none;
          padding: 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          font-weight: 500;
          transition: all 0.3s ease;
          
          @include respond-to('tablet') {
            padding: 20px 30px;
            font-size: 1.1rem;
          }
          
          &:hover {
            color: lighten($primary-color, 30%);
            transform: translateY(-1px);
            
            @include respond-to('tablet') {
              background-color: rgba(255, 255, 255, 0.1);
              transform: translateX(5px);
            }
          }
          
          &.active {
            color: lighten($primary-color, 30%);
            
            &::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 3px;
              background: linear-gradient(90deg, lighten($primary-color, 30%) 0%, white 100%);
              border-radius: 2px;
              animation: slideIn 0.3s ease-out;
              
              @include respond-to('tablet') {
                display: none;
              }
            }
            
            @include respond-to('tablet') {
              background-color: rgba(255, 255, 255, 0.15);
              
              &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background-color: lighten($primary-color, 30%);
              }
            }
          }
          
          svg {
            transition: transform 0.3s ease;
          }
          
          &:hover svg {
            transform: scale(1.2);
          }
=======
    .theme-toggle-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.15);
      color: var(--color-surface);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      font-family: var(--font-family);
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
        
        &::before {
          left: 100%;
        }
      }

      &:active {
        transform: translateY(0);
      }

      svg {
        flex-shrink: 0;
        transition: transform 0.3s ease;
      }
      
      &:hover svg {
        transform: rotate(180deg);
      }
    }
    
    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      font-family: var(--font-family);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
      }
      
      &.btn-primary {
        // Usar el color accent del tema para el botón principal
        background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%);
        color: var(--color-surface);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          
          &::before {
            left: 100%;
          }
        }

        &:active {
          transform: translateY(0);
        }
      }
      
      svg {
        flex-shrink: 0;
        transition: transform 0.3s ease;
      }
      
      &:hover svg {
        transform: scale(1.1);
      }
    }
    
    @media (max-width: 768px) {
      justify-content: center;
      order: 3;
      flex-wrap: wrap;
    }
  }
}

// Animación de brillo
@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

// Responsive adjustments
@media (max-width: 480px) {
  .navbar {
    .navbar-actions {
      .theme-toggle-btn,
      .btn {
        padding: 8px 12px;
        font-size: 13px;
        
        .btn-text {
          display: none;
>>>>>>> 5e78e1a (cambios)
        }
      }
    }
  }
}

<<<<<<< HEAD
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  @include respond-to('tablet') {
    display: flex;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  span {
    width: 25px;
    height: 3px;
    background-color: white;
    margin: 3px 0;
    transition: all 0.3s ease;
    border-radius: 2px;
  }
  
  &.active {
    span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }
    
    span:nth-child(2) {
      opacity: 0;
    }
    
    span:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
=======
// Mejoras de accesibilidad
@media (prefers-reduced-motion: reduce) {
  .navbar {
    &::before {
      animation: none;
    }
    
    .theme-toggle-btn,
    .btn {
      &::before {
        display: none;
      }
      
      &:hover {
        transform: none;
      }
      
      svg {
        transform: none !important;
      }
    }
    
    .navbar-logo .logo-img:hover,
    .navbar-calendar-title h1:hover {
      transform: none;
>>>>>>> 5e78e1a (cambios)
    }
  }
}

<<<<<<< HEAD
.mobile-overlay {
  @include respond-to('tablet') {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
    animation: fadeIn 0.3s ease-out;
  }
=======
// Ajustes para temas específicos
:root {
  // Soft theme adjustments
  &[data-theme="soft"] .navbar {
    .navbar-logo .logo-text,
    .navbar-calendar-title h1 {
      text-shadow: 0 2px 4px rgba(231, 98, 125, 0.3);
    }
  }
  
  // Coral theme adjustments
  &[data-theme="coral"] .navbar {
    .navbar-logo .logo-text,
    .navbar-calendar-title h1 {
      text-shadow: 0 2px 4px rgba(255, 138, 149, 0.3);
    }
  }
  
  // Mint theme adjustments
  &[data-theme="mint"] .navbar {
    .theme-toggle-btn,
    .btn {
      color: var(--color-text);
    }
  }
}

// Hover effects para diferentes temas
.navbar {
  .theme-toggle-btn:hover,
  .btn:hover {
    // Usar el color primario del tema para el efecto hover
    background-color: var(--color-primary);
    color: var(--color-surface);
  }
}

// Transiciones suaves para cambios de tema
* {
  transition: 
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
>>>>>>> 5e78e1a (cambios)
}
</style>