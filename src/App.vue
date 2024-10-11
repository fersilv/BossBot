<template>
  <v-app>
    <v-main>
      <!-- Alerta de socket desconectado -->
      <v-alert
        v-if="!socketStore.connected && auth"
        :color="!socketStore.connected ? 'red-darken-3' : 'green-darken-3'"
        class="py-0 px-0 position-fixed top-0 w-100 rounded-0"
        style="z-index: 1000"
      >
        <v-progress-linear
          :color="!socketStore.connected ? 'red-darken-4' : 'green-darken-4'"
          :height="!socketStore.connected ? 25 : 0"
          indeterminate
        >
          {{ !socketStore.connected ? "Servidor Offline" : "Conectado" }}
        </v-progress-linear>
      </v-alert>

      <!-- Mensagem de IA em pausa -->
      <v-sheet class="iaPaused" v-if="googleIa">
        <v-icon class="mr-2">mdi-briefcase-clock</v-icon>
        IA EM PAUSA {{ googleIa }}
      </v-sheet>

      <!-- Roteamento principal -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useSocketStore } from "./stores/socket";
import { useAppStore } from "./stores/app";

// Obtenha a store do socket e a store do app
const socketStore = useSocketStore();
const appStore = useAppStore();

// Variável computada que reflete o estado de autenticação da store
appStore.checkAuth();
let auth = computed(() => appStore.isAuth);

// Variável computada para o estado do googleIa
const googleIa = computed(() => appStore.googleIa);

// Inicialize o socket quando o componente for montado, se estiver autenticado
onMounted(() => {
  if (auth.value) {
    socketStore.connect();
    appStore.getAllContents();
  }
});

// Fica escutando o isAuth do app e conecta/desconecta o socket conforme a autenticação muda
watch(auth, (newAuthValue) => {
  if (newAuthValue) {
    socketStore.connect();
    appStore.getAllContents();
  } else {
    socketStore.disconnect();
  }
});

// Desconecte o socket quando o componente for desmontado
onUnmounted(() => {
  socketStore.disconnect();
});
</script>
