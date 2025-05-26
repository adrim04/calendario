<template>
  <footer class="footer fade-in">
    <div class="footer-content">
      <div class="footer-info">
        <h4>MyScheduler</h4>
        <p>Gestiona tus eventos de manera eficiente</p>
      </div>
      
      <div class="footer-team">
        <h5>Equipo de desarrollo</h5>
        <div class="team-members">
          <span class="member">Adriana</span>
          <span class="member">Luciana</span>
          <span class="member">Ana</span>
        </div>
      </div>
      
      <div class="footer-year">
        <p>&copy; {{ currentYear }} MyScheduler - Proyecto desarrollado con Vue.js</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent', // ✅ Cambio aquí: nombre multi-word
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/main.scss';

.footer {
  background: linear-gradient(135deg, $dark-color 0%, darken($dark-color, 10%) 100%);
  color: white;
  padding: 30px 0 20px;
  margin-top: auto;
  
  &-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 30px;
    align-items: start;
    
    @include respond-to('tablet') {
      grid-template-columns: 1fr;
      gap: 20px;
      text-align: center;
    }
    
    @include respond-to('mobile') {
      padding: 0 15px;
    }
  }
  
  &-info {
    h4 {
      margin: 0 0 10px 0;
      font-size: 1.3rem;
      color: lighten($primary-color, 20%);
    }
    
    p {
      margin: 0;
      font-size: 0.9rem;
      color: lighten($dark-color, 40%);
    }
  }
  
  &-team {
    h5 {
      margin: 0 0 15px 0;
      font-size: 1.1rem;
      color: white;
    }
    
    .team-members {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      @include respond-to('tablet') {
        flex-direction: row;
        justify-content: center;
        gap: 20px;
      }
      
      .member {
        background-color: rgba(255, 255, 255, 0.1);
        padding: 5px 12px;
        border-radius: 15px;
        font-size: 0.85rem;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
      }
    }
  }
  
  &-year {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    
    @include respond-to('tablet') {
      justify-content: center;
    }
    
    p {
      margin: 0;
      font-size: 0.85rem;
      color: lighten($dark-color, 30%);
    }
  }
}
</style>