<template>
  <ProgressTarefas ref="ProgressTarefas" />
  <ProgressPedidos ref="ProgressPedidos" />
</template>

<script>


export default {
  name: "Dashboard",
  components: {
    ProgressTarefas: () => import("../components/pedidos/ProgressTarefas.vue"),
    ProgressPedidos: () => import("../components/pedidos/ProgressPedidos.vue"),
  },

  data() {
    return {
    };
  },

  methods: {
    //   Função para atualizar o status do pedido

  },
};
</script>