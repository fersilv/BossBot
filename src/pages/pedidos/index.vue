<template>
  <v-container class="pa-10" fluid>
    <v-card class="text-center">
      <v-card-subtitle>PEDIDOS</v-card-subtitle>
      <v-row class="text-center">
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :value="statusPedidos.pending"
                :max="totalPedidos"
                color="primary"
                size="80"
                class="mb-5"
              >
                {{ statusPedidos.pending }}
              </v-progress-circular>
              <br /><spam> PENDENTE </spam>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :value="statusPedidos.processing"
                :max="totalPedidos"
                color="info"
                size="80"
                class="mb-5"
              >
                {{ statusPedidos.processing }}
              </v-progress-circular>
              <br /><spam> PROCESSANDO </spam>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :value="statusPedidos.inprogress"
                :max="totalPedidos"
                color="warning"
                size="80"
                class="mb-5"
              >
                {{ statusPedidos.inprogress }}
              </v-progress-circular>
              <br /><spam> EM PROGRESSO </spam>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- Adicionando o parcial -->
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :value="partialPercent"
                :max="100"
                color="purple-darken-4"
                class="mb-5"
                :rotate="180"
                :size="80"
                :width="15"
              >
                {{ partialPercent }}%
              </v-progress-circular>
              <br /><spam> PARCIAL </spam>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :value="falhaPercent"
                :max="100"
                color="red"
                :size="80"
                class="mb-5"
                :rotate="180"
                :width="15"
              >
                {{ falhaPercent }}%
              </v-progress-circular>
              <br /><spam> FALHA </spam>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :value="concluidoPercent"
                :max="100"
                color="success"
                class="mb-5"
                :rotate="180"
                :size="80"
                :width="15"
              >
                {{ concluidoPercent }}%
              </v-progress-circular>
              <br /><spam> ENTREGUE </spam>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="">
          <v-card class="text-center" elevation="0">
            <v-card-text>
              <v-progress-circular
                :value="canceladoPercent"
                :max="100"
                color="gray"
                class="mb-5"
                :rotate="180"
                :size="80"
                :width="15"
              >
                {{ canceladoPercent }}%
              </v-progress-circular>
              <br /><spam> CANCELADO </spam>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

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
            <v-icon>{{ alertComentarios(item.comments) ? 'mdi-alert-circle-outline' : 'mdi-check-circle-outline' }}</v-icon>
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
            {{ alertComentarios(item.comments) ? 'Analizar comentários' : 'Ver comentários' }}
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
import { useSocketStore } from "@/stores/socket";

export default {
  name: "Pedidos",
  components: { ModalComentarios },
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
          title:"",
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
    await this.pedidosStore.getAllPedidos();
    this.pedidos = this.pedidosStore.pedidos;
    this.loading = false;
    this.atualizarStatusPedidos();
  },
  methods: {
    async atualizarPedidos() {
      await this.pedidosStore.getPedidos();
      this.pedidos = this.pedidosStore.pedidos;
      this.atualizarStatusPedidos();
    },
    atualizarStatusPedidos() {
      // Reiniciar contagem de status
      this.statusPedidos = {
        pending: 0,
        processing: 0,
        inprogress: 0,
        partial: 0, // Incluindo parcial
        error: 0,
        completed: 0,
        canceled: 0,
      };
      // Contar status dos pedidos
      this.pedidos.forEach((item) => {
        if (item.status.toLowerCase() in this.statusPedidos) {
          this.statusPedidos[item.status.toLowerCase()] += 1;
        }
      });
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
    alertComentarios(comentarios)
    {
      // Verifica se tem comentario com status  de erro ou revisao
      if (comentarios.some(comentario => comentario.statusComentario == 'Error' || comentario.statusComentario == 'InRevision'))
      {
        return true;
      }
      else
      {
        return false;
      }
    },
  },
  computed: {
    totalPedidos() {
      return Object.values(this.statusPedidos).reduce((a, b) => a + b, 0);
    },
    concluidoPercent() {
      const totalFinalizadas =
        this.statusPedidos.completed +
        this.statusPedidos.canceled +
        this.statusPedidos.partial + // Incluindo parcial
        this.statusPedidos.error;

      return totalFinalizadas > 0
        ? Math.round((this.statusPedidos.completed / totalFinalizadas) * 100)
        : 0;
    },
    partialPercent() {
      const totalFinalizadas =
        this.statusPedidos.completed +
        this.statusPedidos.canceled +
        this.statusPedidos.partial +
        this.statusPedidos.error;
      return totalFinalizadas > 0
        ? Math.round((this.statusPedidos.partial / totalFinalizadas) * 100)
        : 0;
    },
    falhaPercent() {
      const totalFinalizadas =
        this.statusPedidos.completed +
        this.statusPedidos.canceled +
        this.statusPedidos.partial +
        this.statusPedidos.error;
      return totalFinalizadas > 0
        ? Math.round((this.statusPedidos.error / totalFinalizadas) * 100)
        : 0;
    },
    canceladoPercent() {
      const totalFinalizadas =
        this.statusPedidos.completed +
        this.statusPedidos.canceled +
        this.statusPedidos.partial +
        this.statusPedidos.error;
      return totalFinalizadas > 0
        ? Math.round((this.statusPedidos.canceled / totalFinalizadas) * 100)
        : 0;
    },
  },
  watch: {
    "pedidosStore.pedidos": {
      deep: true,
      handler(newPedidos) {
        newPedidos.forEach((novoPedido) => {
          const index = this.pedidos.findIndex(
            (pedido) => pedido._id === novoPedido._id
          );

          if (index !== -1) {
            // Verifica se o pedido realmente mudou antes de atualizar
            if (
              JSON.stringify(this.pedidos[index]) !== JSON.stringify(novoPedido)
            ) {
              this.pedidos.splice(index, 1, {
                ...this.pedidos[index],
                ...novoPedido,
              });
            }
          } else {
            // Se o pedido não existe, adiciona o novo pedido
            this.pedidos.push(novoPedido);
          }
        });
        // Recalcula os status apenas se houve mudanças
        this.atualizarStatusPedidos();
      },
    },
  },
};
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>
