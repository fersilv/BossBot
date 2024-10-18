/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

const app = createApp(App);

registerPlugins(app);

app.mount("#app");

// Função para verificar se é um dispositivo móvel
function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent);
}

// Registrar o Service Worker apenas em dispositivos móveis
if (isMobile() && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(function (registration) {
      console.log(
        "Service Worker registrado com sucesso em um dispositivo móvel:",
        registration
      );
    })
    .catch(function (error) {
      console.error("Falha ao registrar o Service Worker:", error);
    });
}
