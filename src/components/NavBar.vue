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
  background-color: #b3d9f5; // azul pastel suave
  color: #2c3e50; // azul oscuro legible
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); // sombra más suave

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
      color: #2c3e50; // legible sobre fondo pastel
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
        background-color: #6cbbe8; // azul pastel brillante
        color: white;

        &:hover {
          background-color: darken(#6cbbe8, 10%);
        }
      }
    }
  }
}
</style>
