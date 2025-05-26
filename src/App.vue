<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <div class="calendar-container">
        <CalendarView />
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import CalendarView from './components/Calendar.vue'
import FooterComponent from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    CalendarView,
    FooterComponent
  }
}
</script>

<style lang="scss">
@import './assets/styles/main.scss';

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.calendar-container {
  flex: 1;
  padding: 20px;
  
  @include respond-to('tablet') {
    padding: 15px;
  }
  
  @include respond-to('mobile') {
    padding: 10px;
  }
}
</style>