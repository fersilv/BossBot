<template>
  <v-layout class="overflow-visible" style="height: 56px">
    <v-bottom-navigation v-model="value" :bg-color="color" mode="shift" fixed>
      <v-btn to="/">
        <v-icon>mdi-dots-hexagon</v-icon>

        <span>Dashboard</span>
      </v-btn>

      <v-btn  to="/pedidos">
        <v-icon>mdi-account-heart</v-icon>

        <span>Pedidos</span>
      </v-btn>

      <v-btn to="/contas">
        <v-icon>mdi-robot</v-icon>

        <span>Contas</span>
      </v-btn>

      <v-btn to="/servicos">
        <v-icon>mdi-briefcase-arrow-up-down</v-icon>

        <span>Serviços</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>

<script>
export default {
  data: () => ({ value: 1 }),

  computed: {
    color() {
      switch (this.value) {
        case 0:
          return "blue-grey";
        case 1:
          return "teal";
        case 2:
          return "pink";
        case 3:
          return "indigo";
        default:
          return "blue-grey";
      }
    },
  },
};
</script>
