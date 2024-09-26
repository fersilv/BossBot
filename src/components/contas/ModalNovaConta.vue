<template>
  <v-dialog v-model="dialog" persistent max-width="450px">
    <v-card rounded="xl">
      <v-card-title class="pt-5 pb-0 ps-6">
        <span class="text-h6">Nova Conta</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              @input="error = ''"
              v-model="novaConta.usuario"
              label="Usuario*"
              :rules="[(value) => !!value || 'Usuario é obrigatorio']"
              messages="Usuario de login do instagram"
              variant="solo"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              @input="error = ''"
              type="password"
              v-model="novaConta.senha"
              label="Senha*"
              :rules="[(value) => !!value || 'Senha é obrigatoria']"
              messages="Senha de login do instagram"
              variant="solo"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="8">
              <v-select
                @input="error = ''"
                v-model="novaConta.category"
                label="Rede Social*"
                :items="redesSociais"
                item-title="name"
                item-value="value"
                :rules="[(value) => !!value || 'Rede Social é obrigatorio']"
                messages="Rede Social do Serviço"
                variant="solo"
                required
              ></v-select>
            </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              type="tel"
              v-model="novaConta.limite"
              label="Limite*"
              :rules="[(value) => !!value || 'Limite diário é obrigatorio']"
              messages="Limite diário de ações da conta"
              variant="solo"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text
        v-if="error"
        class="pa-0 pb-1 w-100 text-center text-error"
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
              :loading="loadingSubmit"
              class="w-100"
              color="success"
              @click="cadastrarNovaConta"
              variant="flat"
              rounded="pill"
            >
              Cadastrar
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
      redesSociais: useServicosStore().redesSociais,
      novaConta: {
        usuario: "",
        senha: "",
        limite: "",
        category: "",
      },
      loadingCancel: false,
      loadingSubmit: false,
      contaStore: useContasStore(),
      servicoStore: useServicosStore(),
      error: "",
    };
  },
  methods: {
    handleCancel() {
      this.loadingCancel = true;
      // Simule uma operação assíncrona como uma requisição HTTP
      setTimeout(() => {
        this.novaConta = { usuario: "", senha: "", limite: "" };
        this.dialog = false;
        this.loadingCancel = false;
      }, 1000); // Simula um atraso de 1 segundo
    },
    async cadastrarNovaConta() {
      console.log("chamou cadastrar conta");
      this.loadingSubmit = true;
      //   verifica se todos os campos estao preenchidos e da um trim neles
      if (
        this.novaConta.usuario &&
        this.novaConta.senha &&
        this.novaConta.limite
      ) {
        this.novaConta.usuario = this.novaConta.usuario.trim();
        this.novaConta.senha = this.novaConta.senha.trim();
        this.novaConta.limite = this.novaConta.limite.trim();
      } else {
        this.loadingSubmit = false;
        return;
      }

      try {
        const response = await this.contaStore.cadastrarConta(this.novaConta);
        if (!response.error) {
          this.$emit("novaConta");
          this.loadingSubmit = false;
          this.dialog = false;
          this.novaConta = { usuario: "", senha: "", limite: "" };
        } else {
          this.loadingSubmit = false;
          this.error = response.message ?? "Ocorreu um erro inesperado";
        }
      } catch (error) {
        this.error = error.response.data.message ?? "Ocorreu um erro inesperado";
        this.loadingSubmit = false;
        console.log(error);
      }
    },
  },
};
</script>
