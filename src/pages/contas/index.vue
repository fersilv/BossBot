<template>
  <v-container fluid class="pa-10 pb-4-">
    <v-card class="pa-3 mt-6" elevation="0">
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
    <v-card class="pa-3">
      <v-progress-linear
        :location="null"
        bg-color="#92aed9"
        buffer-color="red"
        buffer-opacity="1"
        :buffer-value="relatorio.porcentagemFem"
        color="#12512a"
        height="6"
        :max="relatorio.porcentagemFem"
        min="0"
        :model-value="relatorio.porcentagemMasc"
        rounded
        reverse
      ></v-progress-linear>
      <v-row>
        <v-col>
          <v-card-title class="text-center">
            <h4>{{ totalMasc }}</h4>
            <small>CONTAS MASCULINAS</small>
          </v-card-title>
        </v-col>
        <v-col>
          <v-card-title class="text-center">
            <h4>{{ totalGeral }}</h4>
            <small>CONTAS DE USUARIOS</small>
          </v-card-title>
        </v-col>
        <v-col>
          <v-card-title class="text-center">
            <h4>{{ totalFem }}</h4>
            <small>CONTAS FEMININAS</small>
          </v-card-title>
        </v-col>
      </v-row>
    </v-card>
  </v-container>

  <!-- Filtros -->
  <v-container fluid class="pa-10 pt-0">
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          variant="solo"
          v-model="search"
          label="Buscar Conta"
          clearable
          outlined
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          variant="solo"
          v-model="selectedGenero"
          :items="generos"
          label="Gênero"
          clearable
          outlined
        ></v-select>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          variant="solo"
          v-model="selectedRedeSocial"
          :items="redesSociais"
          label="Rede Social"
          clearable
          outlined
        ></v-select>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          variant="solo"
          v-model="selectedStatus"
          :items="statusOptions"
          label="Status"
          clearable
          outlined
        ></v-select>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          variant="solo"
          v-model="selectedStatusConta"
          :items="statusContaOptions"
          label="Status Conta"
          clearable
          outlined
        ></v-select>
      </v-col>
    </v-row>

    <!-- Tabela de dados -->
    <v-card rounded="lg" class="pa-3">
      <v-data-title></v-data-title>
      <v-data-text>
        <v-data-table
          :headers="headers"
          :items="filteredContas"
          :loading="loadingConta"
          :loading-text="'Carregando...'"
          :items-per-page-text="'Exibir'"
          :items-per-page-options="[5, 10, 50, 100, -1]"
          :items-per-page="5"
          :no-data-text="'Nenhuma conta encontrada'"
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
          <template v-slot:item.statusConta="{ item }">
            {{ statusConta(item.statusConta) }}
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
              :icon="'mdi-safe-skip'"
              class="mx-2"
              title="Autenticar com Senha"
              disabled
            >
            </v-btn>
          </template>
        </v-data-table>
      </v-data-text>
    </v-card>
  </v-container>
  <ModalNovaConta
    ref="modalNovaConta"
    @novaConta="(loadingConta = true), getAllContas(true)"
  />
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
      search: "",
      selectedGenero: null,
      selectedRedeSocial: null,
      selectedStatus: null,
      selectedStatusConta: null,
      totalGeral: 0,
      totalMasc: 0,
      totalFem: 0,
      relatorio: {},
      generos: [],
      redesSociais: [],
      statusOptions: [],
      statusContaOptions: [],

      contas: [],
      headers: [
        { title: "Identificador", value: "_id", sortable: true, width: "10px" },
        {
          title: "Criado",
          align: "center",
          value: "dataCriacao",
          sortable: true,
          width: "auto",
        },
        { title: "Usuario", value: "usuario", sortable: true, width: "auto" },
        { title: "Gênero", value: "genero", sortable: true, width: "auto" },
        { title: "Limite", value: "limite", sortable: true, width: "auto" },
        {
          title: "Uso Geral",
          value: "quantidadeUsada",
          sortable: true,
          width: "auto",
        },
        {
          title: "Uso Diário",
          value: "usoDiario",
          sortable: true,
          width: "auto",
        },
        {
          title: "Rede Social",
          value: "category",
          sortable: true,
          width: "auto",
        },
        { title: "Status", value: "status", sortable: true, width: "auto" },
        { title: "Conta", value: "statusConta", sortable: true, width: "auto" },
        { title: "", value: "btn", sortable: false, width: "auto" },
      ],
      contasStore: useContasStore(),
      loadingConta: false,
    };
  },

  computed: {
    filteredContas() {
      return this.contas.filter((conta) => {
        const matchesSearch =
          !this.search ||
          conta.usuario.toLowerCase().includes(this.search.toLowerCase()) ||
          conta._id.toLowerCase().includes(this.search.toLowerCase());

        const matchesGenero =
          this.selectedGenero === null || conta.genero === this.selectedGenero;

        const matchesRedeSocial =
          this.selectedRedeSocial === null ||
          conta.category === this.selectedRedeSocial;

        const matchesStatus =
          this.selectedStatus === null ||
          (this.selectedStatus === "Ativa" && conta.status === "true") ||
          (this.selectedStatus === "Inativa" && conta.status === "false");

        const matchesStatusConta =
          this.selectedStatusConta === null ||
          conta.statusConta === this.selectedStatusConta;

        return (
          matchesSearch &&
          matchesGenero &&
          matchesRedeSocial &&
          matchesStatus &&
          matchesStatusConta
        );
      });
    },
  },

  methods: {
    async getAllContas(store = false) {
      if (store) {
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

        // Extraindo as opções dinamicamente das contas
        this.extractFilterOptions();
      } catch (error) {
        console.log(error);
      }
      this.loadingConta = false;
    },

    async totalContas() {
      const contasTotais = await this.contasStore.contas;

      const relatorio = {
        totalGeral: contasTotais.length,
        masculino: {
          total: 0,
          status: {},
          contas: {},
          redesSociais: {},
        },
        feminino: {
          total: 0,
          status: {},
          contas: {},
          redesSociais: {},
        },
        outro: {
          total: 0,
          status: {},
          contas: {},
          redesSociais: {},
        },
        geral: {
          status: {},
          contas: {},
          redesSociais: {},
        },
      };

      contasTotais.forEach((conta) => {
        const genero = conta.genero.toLowerCase();

        // Determine qual categoria de gênero o registro pertence
        let generoKey = "";
        if (genero === "masculino") {
          generoKey = "masculino";
        } else if (genero === "feminino") {
          generoKey = "feminino";
        } else {
          generoKey = "outro";
        }

        // Incrementa o total para o gênero
        relatorio[generoKey].total += 1;

        // Status (ativa/inativa)
        const statusKey = conta.status === "true" ? "Ativa" : "Inativa";
        if (!relatorio[generoKey].status[statusKey]) {
          relatorio[generoKey].status[statusKey] = 0;
        }
        relatorio[generoKey].status[statusKey] += 1;

        if (!relatorio.geral.status[statusKey]) {
          relatorio.geral.status[statusKey] = 0;
        }
        relatorio.geral.status[statusKey] += 1;

        // Status da conta (statusConta)
        const statusContaKey = conta.statusConta;
        if (!relatorio[generoKey].contas[statusContaKey]) {
          relatorio[generoKey].contas[statusContaKey] = 0;
        }
        relatorio[generoKey].contas[statusContaKey] += 1;

        if (!relatorio.geral.contas[statusContaKey]) {
          relatorio.geral.contas[statusContaKey] = 0;
        }
        relatorio.geral.contas[statusContaKey] += 1;

        // Redes sociais (category)
        const redeSocialKey = conta.category;
        if (!relatorio[generoKey].redesSociais[redeSocialKey]) {
          relatorio[generoKey].redesSociais[redeSocialKey] = 0;
        }
        relatorio[generoKey].redesSociais[redeSocialKey] += 1;

        if (!relatorio.geral.redesSociais[redeSocialKey]) {
          relatorio.geral.redesSociais[redeSocialKey] = 0;
        }
        relatorio.geral.redesSociais[redeSocialKey] += 1;
      });

      this.totalGeral = relatorio.totalGeral;
      this.totalMasc = relatorio.masculino.total;
      this.totalFem = relatorio.feminino.total;
      this.totalOutro = relatorio.outro.total;

      relatorio.porcentagemMasc = Math.round(
        (relatorio.masculino.total / relatorio.totalGeral) * 100
      );
      relatorio.porcentagemFem = Math.round(
        (relatorio.feminino.total / relatorio.totalGeral) * 100
      );
      relatorio.porcentagemOutro = Math.round(
        (relatorio.outro.total / relatorio.totalGeral) * 100
      );

      this.relatorio = relatorio;
      return relatorio;
    },

    extractFilterOptions() {
      const generosSet = new Set();
      const redesSociaisSet = new Set();
      const statusSet = new Set();
      const statusContaSet = new Set();

      this.contas.forEach((conta) => {
        generosSet.add(conta.genero);
        redesSociaisSet.add(conta.category);
        statusSet.add(conta.status === "true" ? "Ativa" : "Inativa");
        statusContaSet.add(conta.statusConta);
      });

      this.generos = [...generosSet];
      this.redesSociais = [...redesSociaisSet];
      this.statusOptions = [...statusSet];
      this.statusContaOptions = [...statusContaSet];
    },

    async openModal(conta) {
      await this.$refs.modalNovaConta.modalNovaConta(conta);
    },

    statusConta(status) {
      switch (status) {
        case "Criar":
          return "Fila de Criação";
        case "Criado":
          return "Criado";
        case "Ativo":
          return "Ativo";
        case "Atualizar_Perfil":
          return "Fila de Atualização";
        case "Atualizando_Perfil":
          return "Atualizando";
        case "Bloqueado":
          return "Bloqueado";
        case "Em_Analise":
          return "Suspensa em analise";
        case "Elaborando_Perfil":
          return "Gerando Dados";
        case "Inativo":
          return "Desativado";
        case "Quarentena":
          return "Quarentena";
        case "Interacao_Interna":
          return "Aquecendo";
      }
    },
  },

  mounted() {
    this.getAllContas(true);
    document.title = "Contas | BossBot";
  },

  watch: {
    async "contasStore.contas"() {
      await this.getAllContas();
      await this.totalContas();
    },
  },
};
</script>
