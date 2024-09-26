<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card rounded="xl">
        <v-card-title class="pt-5 pb-0 ps-6">
          <span class="text-h6">{{ isEditing ? "Editando Serviço" : "Novo Serviço" }}</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                @input="error = ''"
                v-model="novoServico.name"
                label="Nome*"
                :rules="[(value) => !!value || 'Nome é obrigatorio']"
                messages="Nome do Serviço"
                variant="solo"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                @input="error = ''"
                v-model="novoServico.typeService"
                label="Tipo de Serviço*"
                :items="typeService"
                item-title="name"
                item-value="value"
                :rules="[(value) => !!value || 'Tipo é obrigatorio']"
                messages="Tipo do Serviço"
                variant="solo"
                :disabled="isEditing"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" md="8">
              <v-select
                @input="error = ''"
                v-model="novoServico.category"
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
              <v-select
                @input="error = ''"
                v-model="novoServico.type"
                label="Tipo*"
                :items="type"
                item-title="text"
                item-value="value"
                :rules="[(value) => !!value || 'Tipo é obrigatorio']"
                messages="Tipo do Serviço"
                variant="solo"
                :disabled="isEditing"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                @input="error = ''"
                v-model="novoServico.rate"
                label="Custo*"
                item-title="text"
                item-value="value"
                :rules="[(value) => !!value || 'Custo é obrigatorio']"
                messages="Custo do Serviço"
                variant="solo"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                @input="error = ''"
                v-model="novoServico.min"
                label="Pedido Minimo*"
                item-title="text"
                item-value="value"
                :rules="[(value) => !!value || 'Minimo é obrigatorio']"
                messages="Minimo do Serviço"
                variant="solo"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                @input="error = ''"
                v-model="novoServico.max"
                label="Pedido Maximo*"
                item-title="text"
                item-value="value"
                :rules="[(value) => !!value || 'Maximo é obrigatorio']"
                messages="Maximo do Serviço"
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
                @click="dialog = false"
                variant="flat"
                rounded="pill"
              >
                Cancelar
              </v-btn>
            </v-col>
            <v-col>
              <v-btn 
                v-if="!isEditing"
                :loading="loadingSave"
                class="w-100"
                color="green"
                @click="createServico"
                variant="flat"
                rounded="pill"
              >
                Salvar
              </v-btn> 
              <v-btn
              v-else
                :loading="loadingSave"
                class="w-100"
                color="green"
                @click="updateServico"
                variant="flat"
                rounded="pill"
              >
                Atualizar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { useServicosStore } from '@/stores/servicos';

export default {
  name: "ModalNovoServico",
  data() {
    return {
      dialog: false,
      loadingCancel: false,
      loadingSave: false,
      isEditing: false,
      redesSociais: useServicosStore().redesSociais,
      typeService: useServicosStore().tipoServico,
      novoServico: {
        name: "",
        category: "",
        type: "",
        rate: "",
        min: "",
        max: "",
        typeService: "",
      },
      type: [{
        text: "Padrão",
        value: "Default",
      },
      {
        text: "Package",
        value: "Package",
      },
      {
        text: "Personalizado",
        value: "Custom Comments",
      }],
      error: "",
      servicoStore: useServicosStore(),
    };
  },
  methods: {
    async createServico(){
        this.loadingSave = true;
        if(!this.novoServico.name || !this.novoServico.type || !this.novoServico.rate || !this.novoServico.min || !this.novoServico.max){
          this.error = "Todos os campos devem ser preenchidos";
          this.loadingSave = false;
          return;
        }
        try{
            const response = await this.servicoStore.createServico(this.novoServico);
            if(response){
              this.$emit("novoServico");
              this.dialog = false;
              this.novoServico = {
                name: "",
                category: "",
                type: "",
                rate: "",
                min: "",
                max: "",
                typeService: "",
              };
            }
            this.loadingSave = false;
        }catch(error){
          console.log(error);
        }
    },
    async updateServico()
    {
        this.loadingSave = true;
        if(!this.novoServico.name || !this.novoServico.type || !this.novoServico.rate || !this.novoServico.min || !this.novoServico.max){
          this.error = "Todos os campos devem ser preenchidos";
          this.loadingSave = false;
          return;
        }
        try{
            const response = await this.servicoStore.updateServico(this.novoServico);
            if(response){
              this.$emit("novoServico");
              this.dialog = false;
              this.novoServico = {
                name: "",
                category: "",
                type: "",
                rate: "",
                min: "",
                max: "",
                typeService: "",
              };
            }
            this.loadingSave = false;
            this.dialog = false;
        }catch(err){
          console.log(err);
          this.loadingSave = false;
          this.error = err;
        }
    },
    openModal(servico = null) {
      this.dialog = true;
      if (servico) {
        console.log(servico)
        this.isEditing = !!servico;
        this.novoServico = {
          _id: servico._id,
          name: servico.name,
          category: servico.category,
          type: servico.type,
          rate: servico.rate,
          min: servico.min,
          max: servico.max,
          typeService: servico.typeService,
        };
      }
    }
  },
  mounted() {
    console.log(this.typeService)
  },

};
</script>