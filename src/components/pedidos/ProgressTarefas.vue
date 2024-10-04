<template>
    <v-container class="pa-10" fluid>
      <v-card class="text-center">
        <v-card-subtitle>TAREFAS</v-card-subtitle>
        <v-row>
          <v-col cols="">
            <v-card class="text-center" elevation="0">
              <v-card-text>
                <v-progress-circular
                  :indeterminate="tarefas.pending > 0"
                  color="primary"
                  size="80"
                  class="mb-5"
                  >{{ tarefas.pending }}</v-progress-circular>
                <br /><spam> NA FILA </spam>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="">
            <v-card class="text-center" elevation="0">
              <v-card-text>
                <v-progress-circular
                  :indeterminate="tarefas.processing > 0"
                  color="info"
                  size="80"
                  class="mb-5"
                  >{{ tarefas.processing }}</v-progress-circular>
                <br /><spam> PROCESSANDO </spam>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="">
            <v-card class="text-center" elevation="0">
              <v-card-text>
                <v-progress-circular
                  :indeterminate="tarefas.inprogress > 0"
                  color="warning"
                  size="80"
                  class="mb-5"
                  >{{ tarefas.inprogress }}</v-progress-circular>
                <br /><spam> EM PROGRESSO </spam>
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
                  {{ tarefas.completed }}
                </v-progress-circular>
                <br /><spam> ENTREGUE </spam>
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
                  {{ tarefas.error }}
                </v-progress-circular>
                <br /><spam> ERRO </spam>
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
                  {{ tarefas.canceled }}
                </v-progress-circular>
                <br /><spam> CANCELADO </spam>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { useSocketStore } from '@/stores/socket';
  
  export default {
    setup() {
      return {
        socket: useSocketStore(),
      };
    },
    data() {
      return {
        tarefas: {
          pending: 0,
          processing: 0,
          inprogress: 0,
          error: 0,
          completed: 0,
          canceled: 0,
        },
      };
    },
    computed: {
      efficiency() {
        const totalFinalizadas =
          this.tarefas.completed + this.tarefas.canceled + this.tarefas.error;
        const totalTarefas =
          this.tarefas.pending +
          this.tarefas.processing +
          this.tarefas.inprogress +
          totalFinalizadas;
  
        return totalFinalizadas > 0
          ? Math.round((this.tarefas.completed / totalFinalizadas) * 100)
          : 0;
      },
      falhaPercent() {
        const totalFinalizadas =
          this.tarefas.completed + this.tarefas.canceled + this.tarefas.error;
        return totalFinalizadas > 0
          ? Math.round((this.tarefas.error / totalFinalizadas) * 100)
          : 0;
      },
      canceladoPercent() {
        const totalFinalizadas =
          this.tarefas.completed + this.tarefas.canceled + this.tarefas.error;
        return totalFinalizadas > 0
          ? Math.round((this.tarefas.canceled / totalFinalizadas) * 100)
          : 0;
      },
    },
    watch: {
      socket: {
        handler() {
          if (this.socket.connected) {
            this.socket.socket.on("pedidos", (data) => {
              this.atualizarPedidos();
            });
            this.socket.socket.on("tarefas", (data) => {
              this.tarefas = data;
            });
          }
        },
        immediate: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .v-progress-circular {
    margin: 1rem;
  }
  </style>
  