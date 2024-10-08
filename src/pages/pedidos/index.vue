<template>
  <v-container class="pa-10" fluid>

    <progress-pedidos :ref="ProgressPedidos" />

    <v-row class="my-5">
      <v-col>
        <h3>PEDIDOS</h3>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="pedidos"
          :loading="loadingPedidos"
          :loading-text="'Carregando...'"
          :items-per-page-text="'Exibir'"
          :items-per-page-options="[5, 10, 50, 100, -1]"
          :no-data-text="'Nenhum Serviço encontrado'"
        >
          <!-- Status com chip -->
          <template v-slot:item.status="{ item }">
            <v-chip :color="badgeStatus(item.status)" small>
              {{ nameStatus(item.status) }}
            </v-chip>
          </template>

          <!-- Demais templates para data, quantidade, etc -->
          <template v-slot:item.date="{ item }">
            {{
              new Date(item.date).toLocaleString("default", {
                timeZone: "Brazil/East",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
          </template>

          <!-- Renderiza ícone da categoria do serviço -->
          <template v-slot:item.service.category="{ item }">
            <v-icon>mdi-{{ item.service.category.toLowerCase() }}</v-icon>
          </template>

          <template v-slot:item.alertError="{ item }">
            <v-icon>{{
              alertComentarios(item.comments)
                ? "mdi-alert-circle-outline"
                : "mdi-check-circle-outline"
            }}</v-icon>
          </template>

          <!-- Renderiza Entregue -->
          <template v-slot:item.comprado="{ item }">
            <div>{{ item.quantity }}</div>
          </template>

          <template v-slot:item.entregue="{ item }">
            <div>
              {{ item.quantity - (item.remains < 0 ? 0 : item.remains) }}
            </div>
          </template>

          <!-- Renderiza Restante -->
          <template v-slot:item.restante="{ item }">
            <div>{{ item.remains < 0 ? 0 : item.remains }}</div>
          </template>

          <!-- Tipo de Serviço -->
          <template v-slot:item.service.type="{ item }">
            <span
              class="text-capitalize"
              v-if="item.service.type !== 'Custom Comments'"
              >{{ item.service.type }}</span
            >
            <v-btn
              v-else
              :color="alertComentarios(item.comments) ? 'warning' : 'blue'"
              size="x-small"
              append-icon="mdi-eye"
              title="Ver comentários"
              @click="$refs.ModalComentarios.openModal(item)"
              rounded
            >
              {{
                alertComentarios(item.comments)
                  ? "Analizar comentários"
                  : "Ver comentários"
              }}
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  <modal-comentarios ref="ModalComentarios" />
</template>

<script>
import { usePedidosStore } from "@/stores/pedidos";
import ModalComentarios from "@/components/pedidos/ModalComentarios.vue";
import ProgressPedidos from "@/components/pedidos/ProgressPedidos.vue";
import { useSocketStore } from "@/stores/socket";

export default {
  name: "Pedidos",
  components: { ModalComentarios, ProgressPedidos },
  setup() {
    return {
      pedidosStore: usePedidosStore(),
      socket: useSocketStore(),
    };
  },
  data() {
    return {
      pedidos: [],
      pedido: {},
      loadingPedidos: false,
      statusPedidos: {
        pending: 0,
        processing: 0,
        inprogress: 0,
        partial: 0, // Incluindo parcial
        error: 0,
        completed: 0,
        canceled: 0,
      },
      loading: true,
      statusOptions: ["Pendente", "Em Andamento", "Concluído"], // opções do dropdown
      headers: [
        { title: "ID", align: "start", value: "_id", sortable: true },
        { title: "Data", value: "date", sortable: true },
        {
          title: "",
          align: "center",
          value: "service.category",
          sortable: true,
        },
        {
          title: "Tipo",
          align: "center",
          value: "service.type",
          sortable: true,
        },
        {
          title: "",
          align: "center",
          value: "alertError",
        },
        { title: "Serviço", value: "service.name", sortable: true },
        {
          title: "Comprado",
          align: "center",
          value: "comprado",
          sortable: true,
        },
        {
          title: "Entregue",
          align: "center",
          value: "entregue",
          sortable: true,
        },
        {
          title: "Restante",
          align: "center",
          value: "restante",
          sortable: true,
        },
        { title: "Status", value: "status", sortable: true },
        { title: "Ações", value: "actions", align: "center" },
      ],
    };
  },
  async mounted() {
    await this.atualizarPedidos();
  },
  methods: {
    async atualizarPedidos() {
      await this.pedidosStore.getAllPedidos();
      this.pedidos = this.pedidosStore.pedidos;
      this.loading = false;
    },
    badgeStatus(status) {
      switch (status.toLowerCase()) {
        case "partial":
          return "warning";
        case "pending":
          return "purple-darken-4";
        case "inprogress":
        case "processing":
          return "info";
        case "completed":
          return "success";
        case "canceled":
          return "grey";
        case "error":
          return "error";
        default:
          return "grey";
      }
    },
    alterarStatus(item, novoStatus) {
      item.status = novoStatus;
      this.atualizarStatusPedidos();
    },
    nameStatus(status) {
      switch (status.toLowerCase()) {
        case "partial":
          return "Parcial";
        case "pending":
          return "Pendente";
        case "inprogress":
          return "Em Progresso";
        case "processing":
          return "Processando";
        case "completed":
          return "Concluído";
        case "canceled":
          return "Cancelado";
        case "error":
          return "Erro";
        default:
          return status;
      }
    },
    alertComentarios(comentarios) {
      if (
        comentarios.some(
          (comentario) =>
            comentario.statusComentario == "Error" ||
            comentario.statusComentario == "InRevision"
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    'pedidosStore.pedido': {
      deep: true,
      handler() {
        this.atualizarPedidos();
      }
    }
  },
  computed: {
    totalPedidos() {
      const total = Object.values(this.statusPedidos).reduce((a, b) => a + b, 0);
      return total > 0 ? total : 1; // Ajuste para evitar valor 0 como max
    },
  },
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>
