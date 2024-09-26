<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card rounded="xl" :loading="loadingDialog">
      <v-card-title class="pt-5 pb-0 ps-6"> Perfis Associados: </v-card-title>
      <v-card-text>
        <v-combobox
          v-model="selectedPerfis"
          chips
          multiple
          label="Combobox"
          :items="filteredContas"
          item-title="usuario"
          item-value="_id"
          append-icon="mdi-content-save-outline"
          @click:append="addPerfis()"
        ></v-combobox>
      </v-card-text>
      <v-card-text>
        <v-data-table
        class="py-4"
          :headers="headersPerfisAssociados"
          :items="perfisAssociados"
          :loading="loadingPerfisAssociados"
          :items-per-page="5"
          density="comfortable"
        >
          <template v-slot:item.acao="{ item }">
            <!-- Botao excluir -->
            <v-btn
              color="red"
              size="x-small"
              icon="mdi-delete"
              class="mx-2"
              title="Excluir Conta"
              @click="removerConta(item)"
              :loading="item.loading"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions class="pt-0 pb-4 px-4">
        <v-row>
          <v-spacer></v-spacer>
          <v-col>
            <v-btn
              :loading="loadingCancel"
              class="w-100"
              color="grey"
              @click="dialog = false"
              variant="flat"
              rounded="pill"
            >
              Fechar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { useServicosStore } from "@/stores/servicos";
import { useContasStore } from "@/stores/contas";

export default {
  name: "ModalUsuariosServico",

  data() {
    return {
      dialog: false,
      loadingCancel: false,
      loadingSave: false,
      loadingDialog: false,
      loadingRemove: false,
      loadingPerfisAssociados: false,
      servico: { _id: "",loading: false },
      redesSociais: useServicosStore().redesSociais,
      headersPerfisAssociados: [
        { title: "Identificador", value: "_id" },
        { title: "Usuario", value: "usuario" },
        { title: "Ação", value: "acao", width: "auto" },
      ],
      perfisAssociados: [{
        loading: false,}],
      contas: [],
      selectedPerfis: [], // Armazena os perfis selecionados
      servicoStore: useServicosStore(),
      contasStore: useContasStore(),
      error: "",
    };
  },

  methods: {
    openModal(servico: any) {
      this.dialog = true;
      this.servico = servico;
      this.perfisAssociados = servico.usuarios.map((usuario : any) => ({
        ...usuario,
        loading: false,
      }));
      this.selectedPerfis = []; // Preenche os perfis selecionados
    },

    async addPerfis() {
      console.log(this.selectedPerfis);
      try {
        this.loadingSave = true;
        await this.servicoStore.updateServicoAssociadosPerfil(
          this.servico._id,
          this.selectedPerfis
        );
        this.loadingSave = false;
        this.dialog = false;
        this.$emit("reloadServico",true);
      } catch (err) {
        console.log(err);
        this.error = err.response.data.message ?? "Ocorreu um erro inesperado";
      }
    },

    async removerConta(conta: any) {
      const contaId = conta._id;
      const serviceId = this.servico._id;

      // Defina o loading do item como true
      const itemToUpdate = this.perfisAssociados.find(
        (item) => item._id === contaId
      );
      if (itemToUpdate) {
        itemToUpdate.loading = true;
      }

      try {
        await this.servicoStore.removeContaServico(serviceId, contaId);
        // para o loading
        this.perfisAssociados = this.perfisAssociados.filter(
          (item) => item._id !== contaId
        );
        // Se o item for atualizado, defina o loading como false novamente

        itemToUpdate.loading = false;

      } catch (err) {
        console.log(err);
        this.error = err.response.data.message ?? "Ocorreu um erro inesperado";

        // Se ocorrer um erro, defina o loading como false novamente
        if (itemToUpdate) {
          itemToUpdate.loading = false;
        }
      }
    },

    async getAllContent() {
      this.loadingDialog = true;
      this.contas = await this.contasStore.contas;
      this.redesSociais = this.servicoStore.redesSociais;
      this.loadingDialog = false;
    },
  },

  computed: {
    filteredContas() {
      return this.contas.filter(
        (conta) =>
          !this.perfisAssociados.some((perfil) => perfil._id === conta._id)
      );
    },
  },

  async mounted() {
    await this.getAllContent();
  },
};
</script>
