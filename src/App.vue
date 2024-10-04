<template>
  <v-app>
    <v-main>
      <v-alert v-if="!socketStore.connected" :color="!socketStore.connected ? 'red-darken-3' : 'green-darken-3'" class="py-0 px-0">
      <v-progress-linear :color="!socketStore.connected ? 'red-darken-4' : 'green-darken-4'" :height="!socketStore.connected ? 25 : 0" indeterminate>{{ !socketStore.connected ? 'Servidor Offline' : 'Conectado' }}</v-progress-linear>
      </v-alert>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useSocketStore } from './stores/socket';
import { useAppStore } from './stores/app';

// Obtenha a store do socket
const socketStore = useSocketStore();
const appStore = useAppStore();
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
