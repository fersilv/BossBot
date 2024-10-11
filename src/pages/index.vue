<template>
  <ProgressTarefas ref="ProgressTarefas" />
  <ProgressPedidos ref="ProgressPedidos" />
</template>

<script>
import { useAppStore } from '@/stores/app';



export default {
  name: "Dashboard",
  components: {
    ProgressTarefas: () => import("../components/pedidos/ProgressTarefas.vue"),
    ProgressPedidos: () => import("../components/pedidos/ProgressPedidos.vue"),
  },

  data() {
    return {
      appStore: useAppStore(),
      loadingDialog: true,
    };
  },

  methods: {


  },


  async mounted() {

  },
};
</script>

<style scoped>
html,
body,
#app,
main {
  overflow: hidden ;
  max-height: calc(100vh - 56px) ;
  height: 100% ;
}

#app > div > div > main > div > div > main {
  overflow: auto !important;
  height: 100% !important;
}

.iaPaused {
  position: fixed !important;
  right: 15px !important;
  bottom: 70px !important;
  background: gold !important;
  padding: 15px !important;
  padding-top: 5px !important;
  padding-bottom: 5px !important;
  border-radius: 50px !important;
  font-weight: bold !important;
  font-size: 10px;
}
</style>