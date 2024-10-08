<template>
  <v-layout class="overflow-visible" style="height: 56px">
    <v-bottom-navigation
      v-model="value"
      :bg-color="color"
      mode="shift"
      class="position-fixed"
      @change="handleNavigation"
    >
      <v-btn :value="0" to="/" exact>
        <v-icon>mdi-dots-hexagon</v-icon>
        <span>Dashboard</span>
      </v-btn>

      <v-btn :value="1" to="/pedidos" exact>
        <v-icon>mdi-account-heart</v-icon>
        <span>Pedidos</span>
      </v-btn>

      <v-btn :value="2" to="/contas" exact>
        <v-icon>mdi-robot</v-icon>
        <span>Contas</span>
      </v-btn>

      <v-btn :value="3" to="/servicos" exact>
        <v-icon>mdi-briefcase-arrow-up-down</v-icon>
        <span>Serviços</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>

<script>
export default {
  data: () => ({ value: 0 }), // Coloquei para começar no Dashboard

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

  methods: {
    handleNavigation() {
      // Quando trocar o valor, o método é chamado
      const routes = ["/", "/pedidos", "/contas", "/servicos"];
      this.$router.push(routes[this.value]);
    },
  },
};
</script>

<style>
html {
  overflow: auto;
  max-height: calc(100vh - 56px)!important;
}
</style>
