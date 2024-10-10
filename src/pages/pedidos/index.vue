<template>
  <progress-pedidos :ref="ProgressPedidos" />

  <v-container class="pa-10 pt-0" fluid>
    <v-row>
      <v-col cols="12">
        <v-data-title>
          <v-row>
            <v-col cols="auto">PEDIDOS</v-col>
            <v-spacer></v-spacer>
            <v-col>
              <v-text-field
                v-model="search"
                append-inner-icon="mdi-magnify"
                label="Pesquisar"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-data-title>
      </v-col>

      <!-- Filtro de data inicial -->
      <v-col cols="auto" v-show="false">
        <v-menu
          v-model="datePickerStart"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="startDate"
              label="Data Inicial"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="startDate"
            @input="datePickerStart = false"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <!-- Filtro de data final -->
      <v-col cols="auto" v-show="false">
        <v-menu
          v-model="datePickerEnd"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="endDate"
              label="Data Final"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="endDate" @input="datePickerEnd = false"></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="pedidosFiltrados"
          :loading="loadingPedidos"
          :loading-text="'Carregando...'"
          :items-per-page-text="'Exibir'"
          :items-per-page-options="[5, 10, 50, 100, -1]"
          :no-data-text="'Nenhum Serviço encontrado'"
          class="pa-6"
          rounded="lg"
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
            <a :href="item.link" target="_blank" rel="noopener noreferrer">
              <v-icon>mdi-{{ item.service.category.toLowerCase() }}</v-icon>
            </a>
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
              :color="
                alertComentarios(item.comments) == 'Nescessita Revisão'
                  ? 'warning'
                  : alertComentarios(item.comments) == 'Ver Comentarios'
                  ? 'blue'
                  : 'purple'
              "
              size="x-small"
              append-icon="mdi-eye"
              title="Ver comentários"
              @click="$refs.ModalComentarios.openModal(item)"
              rounded
            >
              {{ alertComentarios(item.comments) }}
            </v-btn>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              color="primary"
              size="x-small"
              class="mx-1"
              :prepend-icon="item.prioridade != true ? 'mdi-priority-high' : 'mdi-rocket-launch'"
              @click="priorizarPedidoOuCancelar(item._id, 'priorizar')"
              rounded
              :disabled="(item.status == 'Completed' || item.status == 'Partial' || item.status == 'Canceled' || item.status == 'Error') || item.prioridade == true"
            >
              {{ item.prioridade != true ? 'Priorizar' : 'Priorizado' }}
            </v-btn>
            <v-btn
              color="error"
              size="x-small"
              class="mx-1"
              prepend-icon="mdi-close-octagon-outline"
              @click="priorizarPedidoOuCancelar(item._id, 'cancelar')"
              rounded
              :disabled="item.status == 'Completed' || item.status == 'Partial' || item.status == 'Canceled' || item.status == 'Error'"
            >Cancelar</v-btn>
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
      search: "", // Para o campo de busca
      startDate: null, // Data inicial do filtro
      endDate: null, // Data final do filtro
      datePickerStart: false,
      datePickerEnd: false,
      loadingCancel: false,
      loadingPrioritize: false,
      pedidos: [],
      pedido: {},
      loadingPedidos: false,
      statusPedidos: {
        pending: 0,
        processing: 0,
        inprogress: 0,
        partial: 0,
        error: 0,
        completed: 0,
        canceled: 0,
      },
      loading: true,
      statusOptions: ["Pendente", "Em Andamento", "Concluído"], // opções do dropdown
      headers: [
        { title: "ID", align: "start", value: "_id", sortable: true },
        { title: "Data", value: "date", sortable: true },
        { title: "", align: "center", value: "service.category", sortable: true },
        { title: "Tipo", align: "center", value: "service.type", sortable: true },
        { title: "", align: "center", value: "alertError" },
        { title: "Serviço", value: "service.name", sortable: true },
        { title: "Comprado", align: "center", value: "comprado", sortable: true },
        { title: "Entregue", align: "center", value: "entregue", sortable: true },
        { title: "Restante", align: "center", value: "restante", sortable: true },
        { title: "Status", value: "status", sortable: true },
        { title: "Ações", value: "actions", align: "center" },
      ],
    };
  },

  async mounted() {
    this.atualizarPedidos();
  },
  methods: {
    async atualizarPedidos() {
      const pedidos = this.pedidosStore.pedidos;
      this.pedidos = pedidos;
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
          (comentario) => comentario.statusComentario == "Pending"
        )
      ) {
        return "Em Analise";
      }

      if (
        comentarios.some(
          (comentario) =>
            comentario.statusComentario == "Error" ||
            comentario.statusComentario == "InRevision"
        )
      ) {
        return "Nescessita Revisão";
      } else {
        return "Ver Comentarios";
      }
    },
    async priorizarPedidoOuCancelar(id, acao) {
      const response = await this.pedidosStore.priorizarPedidoOuCancelar(id, acao);
      if (response.error) {
        console.log(response.error);
      }
      console.log(response);
    },
  },
  computed: {
    pedidosFiltrados() {
      return this.pedidos.filter((pedido) => {
        const matchesSearch =
          pedido._id.toLowerCase().includes(this.search.toLowerCase()) ||
          pedido.link.toLowerCase().includes(this.search.toLowerCase()) ||
          pedido.comments.some((comment) =>
            comment.comment.toLowerCase().includes(this.search.toLowerCase())
          );

        const pedidoDate = new Date(pedido.date);
        const matchesDate =
          (!this.startDate || pedidoDate >= new Date(this.startDate)) &&
          (!this.endDate || pedidoDate <= new Date(this.endDate));

        return matchesSearch && matchesDate;
      });
    },
  },
  watch: {
    "pedidosStore.pedidos": {
      deep: true,
      handler() {
        this.atualizarPedidos();
      },
    },
    "pedidosStore.pedido"() {
      this.atualizarPedidos();
    },
  },
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>
