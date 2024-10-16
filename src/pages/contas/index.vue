<template>
  <v-container fluid class="pa-10">
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
  <v-container fluid class="pa-10 pt-0">
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
          <!-- data brasileira -->
          <template v-slot:item.dataCriacao="{ item }">
            <spam>{{ new Date(item.dataCriacao).toLocaleDateString() }}</spam>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'true' ? 'green' : 'red'">{{
              item.status === "true" ? "Ativa" : "Inativa"
            }}</v-chip>
          </template>
          <template v-slot:item.btn="{ item }">
            <v-btn
            v-show="false"
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
              :icon="'mdi-pencil'"
              class="mx-2"
              title="Editar Conta"
              @click="openModal(item)"
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

          <template v-slot:item.statusConta="{ item }">
            {{ statusConta(item.statusConta) }}
          </template>
        </v-data-table>
      </v-data-text>
    </v-card>
  </v-container>
  <ModalNovaConta ref="modalNovaConta" @novaConta="loadingConta = true, getAllContas(true)" />
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
        { title: "Identificador", value: "_id", width: "10px" },
        {
          title: "Criado",
          align: "center",
          value: "dataCriacao",
          width: "auto",
        },
        { title: "Usuario", value: "usuario" },
        { title: "Gênero", value: "genero", width: "auto" },
        { title: "Limite", value: "limite", width: "auto" },
        { title: "Uso Geral", value: "quantidadeUsada", width: "auto" },
        { title: "Uso Diário", value: "usoDiario", width: "auto" },
        { title: "Status", value: "status", width: "auto" },
        { title: "Conta", value: "statusConta", width: "auto" },
        { title: "Ação", value: "acao", width: "auto" },
        { title: "", value: "btn" },
      ],
      contasStore: useContasStore(),
      loadingConta: false,
    };
  },

  methods: {
    async getAllContas(store = false) {
      console.log("getAllContas");

      if(store) {
        await this.contasStore.getAllContas();
      }

      try {
        const contas = await this.contasStore.contas;
        this.contas = await contas.map((conta) => {
          return {
            ...conta,
            loading: false,
          };
        });

      } catch (error) {
        console.log(error);
      }
      this.loadingConta = false;
    },
    async createConta() {},
    async deleteConta() {},
    async updateConta() {},
    async openModal(conta) {
      await this.$refs.modalNovaConta.modalNovaConta(conta);
    },

    statusConta(status) {
      switch (status) {
        case "Criar":
          return "Fila de Criação";
          break;
        case "Criado":
          return "Criado";
          break;
        case "Ativo":
          return "Ativo";
          break;
        case "Atualizar_Perfil":
          return "Fila de Atualização";
          break;
        case "Atualizando_Perfil":
          return "Atualizando";
          break;
        case "Bloqueado":
          return "Bloqueado";
          break;
        case "Em_Analise":
          return "Aguardando Aprovação";
          break;
        case "Elaborando_Perfil":
          return "Gerando Dados";
      }
    },
    // async checarConta(conta) {
    //   console.log("checando conta: ", conta);
    //   conta.loading = true;
    //   try {
    //     await this.contasStore.verificarSessao(conta);
    //     conta.loading = false;
    //   } catch (error) {
    //     conta.loading = false;
    //     console.log(error);
    //   }
    // },
  },

  mounted() {
    this.contasStore.getAllContas();
    document.title = "Contas | BossBot";
  },

  watch: {
    async "contasStore.contas"() {

      await this.getAllContas();
    },
  },
};
</script>
