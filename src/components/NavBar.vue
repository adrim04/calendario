<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <img src="../assets/logo.png" alt="MyScheduler Logo" class="logo-img">
        <span class="logo-text">MyScheduler</span>
      </div>
      <div class="navbar-actions">
        <button class="btn btn-primary" @click="$emit('create-event')">
          Nuevo Evento
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style lang="scss" scoped>
.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .navbar-logo {
    display: flex;
    align-items: center;
    
    .logo-img {
      height: 40px;
      margin-right: 10px;
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-weight: bold;
    }
  }
  
  .navbar-actions {
    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-weight: bold;
      
      &.btn-primary {
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
