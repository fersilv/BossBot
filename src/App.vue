<template>
  <v-app>
    <v-main>
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
