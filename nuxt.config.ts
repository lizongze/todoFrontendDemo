// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    '@element-plus/nuxt'
  ],
  devServer: {
    port: 3001,
  },
  routeRules: {
    '/': { redirect: '/todo' }
  },
  $development: {
    routeRules: {
      "/api/**": { proxy: "http://localhost:8080/api/**" },
      // "/api/**": { proxy: "http://172.20.79.145:8080/api/**" },
    },
  },
});
