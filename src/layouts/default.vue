<template>
  <!-- Overlay de loading que cobre a tela até que as verificações sejam concluídas -->
  <v-sheet
    v-if="loading"
    style="position: fixed;z-index: 9999999999; background: rgb(255 255 255);height: 100vh;width: 100vw;"
    class="d-flex justify-center align-center"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    />
  </v-sheet>

  <!-- Exibir login se não estiver autenticado -->
  <template v-if="!auth">
    <!-- Componente de login ou mensagem de não autenticado -->
    <Login />
  </template>

  <!-- Exibir conteúdo do app se estiver autenticado -->
  <template v-else>
    <v-app>
      <v-main>
        <NavBar />
        <router-view />
      </v-main>
    </v-app>
  </template>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAppStore } from "@/stores/app";

// Obtenção da store
const appStore = useAppStore();

// Variável para controlar o loading
const loading = computed(() => appStore.isLoading);

// Função que verifica a autenticação
appStore.checkAuth();
const auth = computed(() => appStore.isAuth);

// Função executada quando o componente é montado
onMounted(() => {

});

// Monitorar mudanças na autenticação
watch(auth, (newAuthValue) => {
  if (newAuthValue) {
    appStore.getAllContents().finally(() => {
    });
  }
});
</script>
