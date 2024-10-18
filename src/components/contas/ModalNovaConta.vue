<template>
  <v-dialog v-model="dialog" persistent max-width="650px">
    <v-card rounded="xl">
      <v-card-title
        class="py-2 pb-0 px-6 d-flex align-center justify-space-between"
      >
        <span class="text-h6">{{
          isEditing ? "Editando Conta" : "Nova Conta"
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              @input="error = ''"
              v-model="conta.usuario"
              label="Usuario*"
              :rules="[(value) => !!value || 'Usuario é obrigatorio']"
              messages="Usuario de login do instagram"
              variant="solo"
              :disabled="isEditing"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              @input="error = ''"
              type="password"
              v-model="conta.senha"
              label="Senha*"
              :rules="[(value) => !!value || 'Senha é obrigatoria']"
              messages="Senha de login do instagram"
              variant="solo"
              required
            ></v-text-field>
          </v-col>
          <!-- Genero -->
          <v-col cols="12" md="6">
            <v-select
              @input="error = ''"
              v-model="conta.genero"
              label="Genero*"
              :items="generos"
              item-title="text"
              item-value="value"
              :rules="[(value) => !!value || 'Genero é obrigatorio']"
              messages="Genero da conta"
              variant="solo"
              :disabled="isEditing"
              required
            ></v-select>
          </v-col>
          <!-- Conta Ativada -->
          <v-col cols="12" md="6" class="d-flex align-center justify-center">
            <v-radio-group
              v-model="conta.statusConta"
              inline
            >
              <v-radio label="Ativa" value="Ativo" selected></v-radio>
              <v-radio label="Popular conta" value="Criar" :disabled="isEditing"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              @input="error = ''"
              v-model="conta.category"
              label="Rede Social*"
              :items="redesSociais"
              item-title="name"
              item-value="value"
              :rules="[(value) => !!value || 'Rede Social é obrigatorio']"
              messages="Rede Social do Serviço"
              variant="solo"
              :disabled="isEditing"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              type="tel"
              v-model="conta.limite"
              label="Limite*"
              :rules="[(value) => !!value || 'Limite diário é obrigatorio']"
              messages="Limite diário de ações da conta"
              variant="solo"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              type="text"
              v-model="conta.perfilReferencia"
              label="Perfil Referencia*"
              :rules="[
                (value) =>
                  conta.statusConta === 'Criar'
                    ? !!value || 'Perfil de referencia é obrigatorio'
                    : true,
              ]"
              messages="Perfil de referencia da conta"
              variant="solo"
              :required="conta.statusConta === 'Criar'"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="conta.dadoRecuperacao"
              label="Email ou Telefone*"
              :rules="[
                (value) => !!value || 'Dado de Recuperação é obrigatorio',
              ]"
              messages="Dado de Recuperação da conta"
              variant="solo"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              type="password"
              v-model="conta.senhaDadoRecuperacao"
              label="Senha"
              messages="Senha de Recuperação"
              variant="solo"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-if="error" class="pa-0 pb-1 w-100 text-center text-error"
        ><small>{{ error }}</small></v-card-text
      >
      <v-card-actions class="pt-0 pb-4 px-4">
        <v-row>
          <v-col>
            <v-btn
              :loading="loadingCancel"
              class="w-100"
              color="grey"
              @click="handleCancel"
              variant="flat"
              rounded="pill"
            >
              Cancelar
            </v-btn>
          </v-col>
          <v-spacer class="d-none d-md-block"></v-spacer>
          <v-col>
            <v-btn
              v-if="!isEditing"
              :loading="loadingSubmit"
              class="w-100"
              color="success"
              @click="cadastrarNovaConta"
              variant="flat"
              rounded="pill"
            >
              Cadastrar
            </v-btn>
            <v-btn
              v-else
              :loading="loadingSubmit"
              class="w-100"
              color="success"
              @click="atualizarConta"
              variant="flat"
              rounded="pill"
            >
              Salvar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useContasStore } from "@/stores/contas";
import { useServicosStore } from "@/stores/servicos";

export default {
  name: "ModalNovaConta",
  data() {
    return {
      dialog: false,
      redesSociais: [],
      isEditing: false,
      conta: {
        usuario: "",
        senha: "",
        limite: "",
        category: "",
        dadoRecuperacao: "",
        senhaDadoRecuperacao: null,
        statusConta: "Ativo",
        genero: "",
        perfilReferencia: "",
      },
      loadingCancel: false,
      loadingSubmit: false,
      contaStore: useContasStore(),
      servicoStore: useServicosStore(),
      error: "",
      generos: ["Masculino", "Feminino", "Outro"],
      statuConta: ["Ativo", "Criar"],
    };
  },
  methods: {
    handleCancel() {
      this.loadingCancel = true;
      this.dialog = false;
      // Simule uma operação assíncrona como uma requisição HTTP
      setTimeout(() => {
        this.conta = {
          usuario: "",
          senha: "",
          limite: "",
          category: "",
          dadoRecuperacao: "",
          senhaDadoRecuperacao: null,
        };
        this.loadingCancel = false;
      }, 1000); // Simula um atraso de 1 segundo
    },
    async cadastrarNovaConta() {
      this.loadingSubmit = true;
      //   verifica se todos os campos estao preenchidos e da um trim neles
      if (
        this.conta.usuario &&
        this.conta.senha &&
        this.conta.limite &&
        this.conta.category &&
        this.conta.dadoRecuperacao &&
        this.conta.senhaDadoRecuperacao &&
        this.conta.genero &&
        this.conta.statusConta
      ) {
        this.conta.usuario = this.conta.usuario.trim();
        this.conta.senha = this.conta.senha.trim();
        this.conta.limite = this.conta.limite.trim();
        this.conta.dadoRecuperacao = this.conta.dadoRecuperacao.trim();
      } else {
        this.loadingSubmit = false;
        return;
      }

      if (this.conta.statuConta == "Criar" && !this.conta.perfilReferencia) {
        this.error = "Informe um perfil (Apenas usuario sem o @) de Referência";
        return;
      }

      try {
        const response = await this.contaStore.cadastrarConta(this.conta);
        if (!response.error) {
          this.$emit("novaConta");
          this.loadingSubmit = false;
          this.dialog = false;
          this.conta = {
            usuario: "",
            senha: "",
            limite: "",
            category: "",
            dadoRecuperacao: "",
            senhaDadoRecuperacao: null,
          };
        } else {
          this.loadingSubmit = false;
          this.error = response.message ?? "Ocorreu um erro inesperado";
        }
      } catch (error) {
        this.loadingSubmit = false;
        this.error =
          error.response.data.message ?? "Ocorreu um erro inesperado";
        console.log(error);
      }
    },

    async atualizarConta() {
      if (!this.conta._id) return;
      this.loadingSubmit = true;
      //   verifica se todos os campos estao preenchidos e da um trim neles
      if (
        this.conta.usuario &&
        this.conta.senha &&
        this.conta.limite &&
        this.conta.category &&
        this.conta.dadoRecuperacao &&
        this.conta.senhaDadoRecuperacao &&
        this.conta.genero &&
        this.conta.statusConta
      ) {
        this.conta.usuario = this.conta.usuario.trim();
        this.conta.senha = this.conta.senha.trim();
        this.conta.limite = this.conta.limite.trim();
        this.conta.dadoRecuperacao = this.conta.dadoRecuperacao.trim();
      } else {
        this.loadingSubmit = false;
        return;
      }

      try {
        const response = await this.contaStore.atualizarConta(this.conta);
        if (!response.error) {
          this.$emit("novaConta");
          this.loadingSubmit = false;
          this.dialog = false;
          this.conta = {
            usuario: "",
            senha: "",
            limite: "",
            category: "",
            dadoRecuperacao: "",
            senhaDadoRecuperacao: null,
          };
        } else {
          this.loadingSubmit = false;
          this.error = response.message ?? "Ocorreu um erro inesperado";
        }
      } catch (error) {
        this.loadingSubmit = false;
        this.error =
          error.response.data.message ?? "Ocorreu um erro inesperado";
        console.log(error);
      }
    },

    async modalNovaConta(conta = null) {
      if (conta) {
        this.isEditing = true;
        this.conta = { ...conta };
      }
      this.dialog = true;
    },
  },
  async mounted() {
    this.redesSociais = await this.servicoStore.redesSociais;
  },
  watch: {
    "servicoStore.redesSociais": {
      immediate: true,
      handler() {
        this.redesSociais = this.servicoStore.redesSociais;
      },
    },
  },
};
</script>
