<template>
  <v-container>
    <v-card class="pa-3 mt-6">
      <v-data-title>
        <v-row>
          <v-col cols="auto">CONTAS DE USUARIOS</v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn
              color="green"
              size="small"
              @click="$refs.modalNovaConta.dialog = true"
              prepend-icon="mdi-plus"
              class="mx-2"
              title="Adicionar Conta"
              rounded
              >Adicionar Conta
            </v-btn>
          </v-col>
        </v-row>
      </v-data-title>
    </v-card>
  </v-container>
  <v-container>
    <v-card rounded="lg" class="pa-3">
      <v-data-title></v-data-title>
      <v-data-text>
        <v-data-table
          :headers="headers"
          :items="contas"
          :loading="loadingConta"
          :loading-text="'Carregando...'"
          :items-per-page-text="'Exibir'"
          :items-per-page-options="[5, 10, 50, 100, -1]"
          :no-data-text="'Nenhuma conta encontrado'"
        >
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'true' ? 'green' : 'red'">{{
              item.status === "true" ? "Autenticado" : "Falha"
            }}</v-chip>
          </template>
          <template v-slot:item.btn="{ item }">
            <v-btn
              color="red"
              size="x-small"
              @click="deleteConta(item)"
              icon="mdi-delete"
              class="mx-2"
              title="Excluir Conta"
            ></v-btn>
            <!-- Botão exibido quando item.status é 'true' -->
            <v-btn
              v-if="item.status === 'true'"
              :color="'blue'"
              size="x-small"
              :icon="'mdi-reload'"
              class="mx-2"
              title="Checar Autenticação"
              @click="checarConta(item)"
              :loading="item.loading"
            >
            </v-btn>

            <!-- Botão exibido quando item.status NÃO é 'true' -->
            <v-btn
              v-else
              :color="'green'"
              size="x-small"
              :loading="item.loading"
              :icon="'mdi-cloud-key-outline'"
              class="mx-2"
              title="Autenticar com Senha"
            >
            </v-btn>
          </template>
          <template v-slot:item.acao="{ item }">
            <spam>
              {{
                item.status == "false"
                  ? "Sem Autenticação"
                  : item.acao ?? "Parado"
              }}
            </spam>
          </template>
        </v-data-table>
      </v-data-text>
    </v-card>
  </v-container>
  <ModalNovaConta ref="modalNovaConta" @novaConta="loadingConta = true" />
</template>

<script>
import ModalNovaConta from "@/components/contas/ModalNovaConta.vue";
import { useContasStore } from "../../stores/contas";

export default {
  name: "Contas",
  components: {
    ModalNovaConta,
  },
  data() {
    return {
      contas: [],
      headers: [
        { title: "Identificador", value: "_id" },
        { title: "Usuario", value: "usuario" },
        { title: "Status", value: "status", width: "auto" },
        { title: "Ação", value: "acao", width: "auto" },
        { title: "", value: "btn" },
      ],
      contasStore: useContasStore(),
      loadingConta: false,
    };
  },

  methods: {
    async getAllContas() {
      try {
        this.contas = this.contasStore.contas;
      } catch (error) {
        console.log(error);
      }
    },
    async createConta() {},
    async deleteConta() {},
    async updateConta() {},
    async statusConta() {},
    async checarConta(conta) {
      console.log("checando conta: ", conta);
      conta.loading = true;
      try {
        await this.contasStore.verificarSessao(conta);
        conta.loading = false;
      } catch (error) {
        conta.loading = false;
        console.log(error);
      }
    },
  },

  mounted() {
    this.getAllContas();
    document.title = "Contas | BossBot";
  },

  watch: {
    async "contasStore.contas"() {
      
      this.loadingConta = true;

      this.contas = await this.contasStore.contas;

      this.loadingConta = false;

    },
  },
};
</script>
