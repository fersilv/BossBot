<template>
  <v-app>
    <v-main>
      <v-alert
        v-if="!socketStore.connected"
        :color="!socketStore.connected ? 'red-darken-3' : 'green-darken-3'"
        class="py-0 px-0 position-fixed top-0 w-100 rounded-0"
        style="z-index: 1000"
      >
        <v-progress-linear
          :color="!socketStore.connected ? 'red-darken-4' : 'green-darken-4'"
          :height="!socketStore.connected ? 25 : 0"
          indeterminate
          >{{
            !socketStore.connected ? "Servidor Offline" : "Conectado"
          }}</v-progress-linear
        >
      </v-alert>
      <v-sheet class="iaPaused" v-if="googleIa">
      <v-icon class="mr-2">mdi-briefcase-clock</v-icon>
      IA EM PAUSA {{ googleIa }}
    </v-sheet>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useSocketStore } from "./stores/socket";
import { useAppStore } from "./stores/app";

// Obtenha a store do socket
const socketStore = useSocketStore();
const appStore = useAppStore();

const googleIa = appStore.googleIa;
console.log(googleIa);
// Inicialize o socket quando o componente for montado
onMounted(() => {
  socketStore.connect();
  appStore.getAllContents();
});

// Desconecte o socket quando o componente for desmontado
onUnmounted(() => {
  socketStore.disconnect();
});
</script>

<style>
html,
body,
#app,
main {
  overflow: none !important;
  max-height: calc(100vh - 56px) !important;
  height: 100% !important;
}

main > .v-application,
main > .v-application > div {
  overflow: none !important;
  height: 100% !important;
}

.iaPaused {
  position: fixed!important;
  right: 15px!important;
  bottom: 70px!important;
  background: gold!important;
  padding: 15px!important;
  padding-top: 5px!important;
  padding-bottom: 5px!important;
  border-radius: 50px!important;
  font-weight: bold!important;
  font-size: 10px;
}
</style>
