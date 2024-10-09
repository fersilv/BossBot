<template>
  <v-dialog v-model="dialog" persistent max-width="850px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Comentarios</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-data-table
            :headers="headers"
            :items="comentarios"
            :loading="loading"
            loading-text="Carregando..."
            :items-per-page="5"
            density="comfortable"
            :items-per-page-options="[5]"
          >
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
            <template v-slot:item.statusComentario="{ item }">
              <v-chip :color="badgeStatus(item.statusComentario)" small>
                {{ nameStatus(item.statusComentario) }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn color="red" size="x-small" class="mx-1" prepend-icon="mdi-stop" @click="atualizarComentario(item._id,'Rejected',true)" :disabled="(item.statusComentario == 'Approved' || item.statusComentario == 'Rejected') && (item.status !== 'Pending' || item.status !== 'Error')" rounded> Rejeitar
              </v-btn>
              <v-btn color="teal" size="x-small" class="mx-1" prepend-icon="mdi-check" @click="atualizarComentario(item._id,'Approved',true)" :disabled="item.statusComentario == 'Approved' || item.statusComentario == 'Rejected'" rounded> Aprovar
              </v-btn>
              <v-btn v-if="item.status == 'Error'" color="warning" size="x-small" class="mx-1" prepend-icon="mdi-restart" @click="atualizarComentario(item._id,'Restart',false)" :disabled="(item.statusComentario == 'Approved' || item.statusComentario !== 'Pending') && item.status !== 'Error'" rounded> Reiniciar
              </v-btn>
            </template>
          </v-data-table>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { usePedidosStore } from '@/stores/pedidos';

export default {
  props: ["comentarios"],
  data() {
    return {
      dialog: false,
      loading: false,
      comentarios: [],
      pedido: {},
      headers: [
        { title: "Comentários", align: "start", value: "comment" },
        { title: "Data", value: "date" },
        { title: "Status", align: "center", value: "statusComentario" }, // Corrigido para statusComentarios
        { title: "Ações", align: "center", value: "actions" },
      ],
      pedidosStore: usePedidosStore()
    };
  },

  methods: {

    async atualizarComentario(id, status, comment) {
      try{
      const atual = await this.pedidosStore.atualizarComentario(id, status,comment);
      // localiza o comentario e atualiza os dados dele
      const index = this.comentarios.findIndex(comentario => comentario._id === atual._id);
      if (index !== -1) {
        this.comentarios.splice(index, 1, atual);
      }
      } catch (error)
      {
        console.log(error);
      }
    },
    openModal(pedido) {
      this.dialog = true;
      this.comentarios = pedido.comments; // Certifique-se de que 'pedido.comments' está correto
      this.pedido = pedido;
    },

    badgeStatus(status) {
      switch (status) {
        case "Partial":
        case "partial":
        case "InRevision":
        case "inrevision":
          return "warning";
        case "Pending":
        case "pending":
          return "purple-darken-4";
        case "Inprogress":
        case "inprogress":
          return "info";
        case "Completed":
        case "completed":
        case "Approved":
        case "approved":
          return "success";
        case "Canceled":
        case "canceled":
          return "grey";
        case "Error":
        case "error":
        case "Rejected":
        case "rejected":
          return "error";
        default:
          return "grey"; // Alterado para uma cor neutra caso não corresponda a nenhum status
      }
    },
    nameStatus(status) {
      switch (status) {
        case "Partial":
        case "partial":
        case "InRevision":
        case "inrevision":
          return "Em Revisão";
        case "Pending":
        case "pending":
          return "Pendente";
        case "Inprogress":
        case "inprogress":
          return "Em Andamento";
        case "Completed":
        case "completed":
        case "Approved":
        case "approved":
          return "Aprovado";
        case "Canceled":
        case "canceled":
          return "grey";
        case "Error":
        case "error":
        case "Rejected":
        case "rejected":
          return "Rejeitado";
        default:
          return "Indefinido"; // Alterado para uma cor neutra caso não corresponda a nenhum status
      }
    },
  },
};
</script>
