<template>
  <v-container class="pa-10" fluid>
    <v-card class="text-center">
      <v-card-subtitle>PEDIDOS</v-card-subtitle>
      <v-row>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :value="pedidos.pending"
                :max="totalPedidos"
                color="primary"
                size="80"
                class="mb-5"
              >
                {{ pedidos.pending }}
              </v-progress-circular>
              <br /><span> NA FILA </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :value="pedidos.processing"
                :max="totalPedidos"
                color="info"
                size="80"
                class="mb-5"
              >
                {{ pedidos.processing }}
              </v-progress-circular>
              <br /><span> PROCESSANDO </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :value="pedidos.inprogress"
                :max="totalPedidos"
                color="warning"
                size="80"
                class="mb-5"
              >
                {{ pedidos.inprogress }}
              </v-progress-circular>
              <br /><span> EM PROGRESSO </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :model-value="efficiency"
                :rotate="180"
                :size="80"
                :width="15"
                color="green"
              >
                {{ pedidos.completed }}
              </v-progress-circular>
              <br /><span> ENTREGUE </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :model-value="falhaPercent"
                :rotate="180"
                :size="80"
                :width="15"
                color="red"
              >
                {{ pedidos.error }}
              </v-progress-circular>
              <br /><span> ERRO </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :model-value="canceladoPercent"
                :rotate="180"
                :size="80"
                :width="15"
                color="gray"
              >
                {{ pedidos.canceled }}
              </v-progress-circular>
              <br /><span> CANCELADO </span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { usePedidosStore } from "@/stores/pedidos";
import { reactive, watch } from "vue";

export default {
  setup() {
    const pedidosStore = usePedidosStore();

    // Tornar o objeto 'pedidos' reativo
    const pedidos = reactive({
      pending: 0,
      processing: 0,
      inprogress: 0,
      error: 0,
      completed: 0,
      canceled: 0,
    });

    const getPedidos = async () => {
      await pedidosStore.getAllPedidos();
      const pedidosData = pedidosStore.pedidos;

      pedidos.pending = pedidosData.filter(
        (pedido) => pedido.status === "Pending"
      ).length;
      pedidos.processing = pedidosData.filter(
        (pedido) => pedido.status === "Processing"
      ).length;
      pedidos.inprogress = pedidosData.filter(
        (pedido) => pedido.status === "Inprogress"
      ).length;
      pedidos.error = pedidosData.filter(
        (pedido) => pedido.status === "Error"
      ).length;
      pedidos.completed = pedidosData.filter(
        (pedido) => pedido.status === "Completed"
      ).length;
      pedidos.canceled = pedidosData.filter(
        (pedido) => pedido.status === "Canceled"
      ).length;
    };

    // Monitorar mudanças no store de pedidos para atualizar os gráficos
    // Monitorar mudanças no store de pedidos para atualizar os gráficos
    watch(
      () => pedidosStore.pedido, // O que observar
      () => {
        // Ação quando o valor mudar
        getPedidos();
      },
      { deep: true } // Opções, como deep: true
    );
    return {
      pedidos,
      pedidosStore,
    };
  },
  computed: {
    totalPedidos() {
      return (
        this.pedidos.pending +
        this.pedidos.processing +
        this.pedidos.inprogress +
        this.pedidos.error +
        this.pedidos.completed +
        this.pedidos.canceled
      );
    },
    efficiency() {
      const totalFinalizadas =
        this.pedidos.completed + this.pedidos.canceled + this.pedidos.error;
      const totalTarefas =
        this.pedidos.pending +
        this.pedidos.processing +
        this.pedidos.inprogress +
        totalFinalizadas;

      return totalFinalizadas > 0
        ? Math.round((this.pedidos.completed / totalFinalizadas) * 100)
        : 0;
    },
    falhaPercent() {
      const totalFinalizadas =
        this.pedidos.completed + this.pedidos.canceled + this.pedidos.error;
      return totalFinalizadas > 0
        ? Math.round((this.pedidos.error / totalFinalizadas) * 100)
        : 0;
    },
    canceladoPercent() {
      const totalFinalizadas =
        this.pedidos.completed + this.pedidos.canceled + this.pedidos.error;
      return totalFinalizadas > 0
        ? Math.round((this.pedidos.canceled / totalFinalizadas) * 100)
        : 0;
    },
  },
  async mounted() {
    await this.pedidosStore.getAllPedidos();
  },
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>
