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
    async getAllContent() {
      this.loadingDialog = true;
      await this.appStore.getAllContents();
      this.loadingDialog = false;
    },

  },

  async mounted() {
    await this.getAllContent();
  },
};
</script>