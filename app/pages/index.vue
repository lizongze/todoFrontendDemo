<template>
  <div class="home-container">
    <h1>Welcome to Nuxt 4 App</h1>
    <div class="nav-links">
      <NuxtLink to="/todo">
        <el-button type="primary" size="large">Go to Todo App</el-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple Landing Page
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: sans-serif;
}

h1 {
  margin-bottom: 2rem;
  color: #333;
}
</style>
