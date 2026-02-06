// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  devServer: {
    port: 3001,
  },
  $development: {
    routeRules: {
      "/api/**": { proxy: "http://localhost:8080/api/**" },
      // "/api/**": { proxy: "http://172.20.79.145:8080/api/**" },
    },
  },
});
