<template>
  <v-container class="pa-10" fluid>
    <v-card class="text-center pa-6" rounded="lg">
      <v-card-subtitle>PEDIDOS</v-card-subtitle>
      <v-row>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :value="pending"
                :max="totalPedidos"
                color="primary"
                size="80"
                class="mb-5"
              >
                {{ pending }}
              </v-progress-circular>
              <br /><span> NA FILA </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :value="processing"
                :max="totalPedidos"
                color="info"
                size="80"
                class="mb-5"
              >
                {{ processing }}
              </v-progress-circular>
              <br /><span> PROCESSANDO </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :value="inprogress"
                :max="totalPedidos"
                color="warning"
                size="80"
                class="mb-5"
              >
                {{ inprogress }}
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
                {{ completed }}
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
                {{ error }}
              </v-progress-circular>
              <br /><span> ERRO </span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :model-value="partialPercent"
                :rotate="180"
                :size="80"
                :width="15"
                color="orange"
              >
                {{ partial }}
              </v-progress-circular>
              <br /><span> PARCIAL </span>
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
                {{ canceled }}
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

export default {
  name: "ProgressPedidos",
  data() {
    return {
      loadingPedidos: true,
      pedidosStore: usePedidosStore(),
      pending: 0,
      processing: 0,
      partial: 0,
      inprogress: 0,
      error: 0,
      completed: 0,
      canceled: 0,
    };
  },  
  methods: {
    async getAllPedidos() {
      const pedidosData = this.pedidosStore.pedidos;
      this.pending = pedidosData.filter((pedido) => pedido.status === "Pending").length;
      this.processing = pedidosData.filter((pedido) => pedido.status === "Processing").length;
      this.inprogress = pedidosData.filter((pedido) => pedido.status === "Inprogress").length;
      this.error = pedidosData.filter((pedido) => pedido.status === "Error").length;
      this.completed = pedidosData.filter((pedido) => pedido.status === "Completed").length;
      this.canceled = pedidosData.filter((pedido) => pedido.status === "Canceled").length;
    }
  },
  watch: {
    'pedidosStore.pedidos': {
      deep: true,
      handler() {
        this.getAllPedidos();
      }
    },
    'pedidosStore.pedido' () {
      this.getAllPedidos();
    }
  },
  mounted() {
    // this.pedidosStore.getAllPedidos();
    this.getAllPedidos();
  },
  computed: {
    totalPedidos() {
      return (
        this.pending +
        this.processing +
        this.inprogress +
        this.error +
        this.completed +
        this.canceled
      );
    },
    efficiency() {
      const totalFinalizadas =
        this.completed + this.canceled + this.error + this.partial;
      const totalTarefas =
        this.pending +
        this.processing +
        this.inprogress +
        totalFinalizadas;

      return totalFinalizadas > 0
        ? Math.round((this.completed / totalFinalizadas) * 100)
        : 0;
    },
    falhaPercent() {
      const totalFinalizadas =
        this.completed + this.canceled + this.error + this.partial;
      return totalFinalizadas > 0
        ? Math.round((this.error / totalFinalizadas) * 100)
        : 0;
    },
    partialPercent() {
      const totalFinalizadas =
        this.completed + this.canceled + this.error + this.partial;
      return totalFinalizadas > 0
        ? Math.round((this.partial / totalFinalizadas) * 100)
        : 0;
    },
    canceladoPercent() {
      const totalFinalizadas =
        this.completed + this.canceled + this.error + this.partial;
      return totalFinalizadas > 0
        ? Math.round((this.canceled / totalFinalizadas) * 100)
        : 0;
    },
  },
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>
