<template>
  <v-container>
    <v-card class="pa-3">
      <v-data-title>
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn
              color="green"
              size="small"
              @click="$refs.ModalNovoServico.openModal()"
              prepend-icon="mdi-plus"
              class="mx-2"
              title="Adicionar Serviço"
              rounded
              >Adicionar Serviço
            </v-btn>
          </v-col>
        </v-row>
      </v-data-title>
    </v-card>
  </v-container>
  <v-container>
    <v-card>
      <v-data-title></v-data-title>
      <v-data-text>
        <v-data-table
          :headers="headers"
          :items="servicos"
          :loading="loadingServico"
          :loading-text="'Carregando...'"
          :items-per-page-text="'Exibir'"
          :items-per-page-options="[5, 10, 50, 100, -1]"
          :no-data-text="'Nenhum Serviço encontrado'"
        >
          <template v-slot:item.rate="{ item }">
            {{ valorBr(item.rate) }}
          </template>
          <template v-slot:item.type="{ item }">
            {{
              item.type == "Default"
                ? "Padrão"
                : item.type == "Custom Comments"
                ? "Personalizado"
                : item.type == "Package"
                ? "Package"
                : "??"
            }}
          </template>
          <template v-slot:item.usuarios="{ item }">
            <v-row>
              <v-col
                class="d-flex text-center py-0"
                style="justify-content: center; align-items: center"
              >
                {{ item.usuarios.length }}
              </v-col>
              <v-col class="py-0">
                <v-btn
                  color="green"
                  size="x-small"
                  icon="mdi-account-edit"
                  title="Gerenciar Usuários associados o serviço"
                  @click="openModalUsuarioServico(item)"
                                  ></v-btn>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.btn="{ item }">
            <v-btn
              color="red"
              size="x-small"
              @click="deleteServico(item)"
              icon="mdi-delete"
              class="mx-2"
              title="Excluir Serviço"
            ></v-btn>
            <!-- Botão exibido quando item.status é 'true' -->
            <v-btn
              :color="'blue'"
              size="x-small"
              :icon="'mdi-pencil'"
              class="mx-2"
              title="Editar Serviço"
              @click="$refs.ModalNovoServico.openModal(item)"
              :loading="item.loading"
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
  <ModalNovoServico ref="ModalNovoServico" @novoServico="getAllServicos" />
  <ModalUsuariosServico ref="ModalUsuariosServico" @reloadServico="getAllServicos" />
</template>

<script>
import ModalNovoServico from "@/components/servicos/ModalNovoServico.vue";
import ModalUsuariosServico from "@/components/servicos/ModalUsuariosServico.vue";
import { useServicosStore } from "../../stores/servicos";

export default {
  name: "Servicos",
  components: {
    ModalNovoServico,
    ModalUsuariosServico,
  },
  data() {
    return {
      servicos: [],
      redesSociais: [],
      headers: [
        { title: "Serviço", value: "name" },
        { title: "min", value: "min", width: "auto" },
        { title: "max", value: "max", width: "auto" },
        { title: "Custo", value: "rate", width: "auto" },
        { title: "Tipo", value: "type", width: "auto" },
        { title: "Contas", align: "center", value: "usuarios", width: "auto" },
        { title: "", value: "btn" },
      ],
      servicosStore: useServicosStore(),
      loadingServico: false,
    };
  },

  methods: {
    async getAllServicos() {
      this.loadingServico = true;
      try {
        const resp = this.servicos = await this.servicosStore.servicos;
        this.loadingServico = false
      } catch (error) {
        console.log(error);
        this.loadingServico = false
      }
    },
    async createServico() {},
    async deleteServico() {},
    async updateServico() {},
    async statusServico() {},

    async openModalUsuarioServico(servico){
      await this.getAllServicos();
      this.$refs.ModalUsuariosServico.openModal(servico)
    },
    async checarServico(Servico) {
      console.log("checando Servico: ", Servico);
      Servico.loading = true;
      try {
        await this.ServicosStore.verificarSessao(Servico);
        Servico.loading = false;
      } catch (error) {
        Servico.loading = false;
        console.log(error);
      }
    },
    valorBr(valor) {
      // return valor.toLocaleString("pt-BR", {
      //   style: "currency",
      //   currency: "BRL",
      // });

      return valor
    },
  },

  mounted() {
    this.getAllServicos();
    document.title = "Servicos | BossBot";
  },

  watch: {
    async "servicosStore.servico"(newVal) {
      this.loadingServico = true;
      await this.getAllServicos();
      this.loadingServico = false;
    },
  },
};
</script>
