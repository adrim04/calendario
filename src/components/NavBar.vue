<template>
  <header class="navbar slide-in">
    <div class="navbar-container">
      <div class="navbar-logo">
        <h1>
          <font-awesome-icon :icon="['fas', 'calendar-alt']" />
          MyScheduler
        </h1>
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
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/main.scss';

.navbar {
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    
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
        }
      }
    }
  }
}

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
    }
  }
}

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
}
</style>