<template>
  <footer class="footer">
    <div class="footer-container">
      <p>&copy; {{ currentYear }} MyScheduler - Proyecto TecWeb</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>
<style lang="scss" scoped>
.footer {
  background-color: #e0f3fb;
  color: #33667a;
  padding: 15px 0;
  margin-top: auto;

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;

    p {
      margin: 0;
    }
  }
}
</style>
