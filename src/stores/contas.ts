import axios from "axios";
import { defineStore } from "pinia";
import { useAppStore } from "./app";

export const useContasStore = defineStore("contas", {
  state: () => ({
    contas: [] as any,
    conta: {},
    token: useAppStore().token,
  }),
  actions: {
    async getAllContas() {
      try {
        const response = (
          await axios.get(import.meta.env.VITE_URL_BACKEND + "usuario", {
            headers: {
              'Authorization': `Bearer ${this.token}`,
            },
          })
        ).data;
        this.contas = await response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async cadastrarConta(conta: any) {
      try {
        const response = (
          await axios.post(import.meta.env.VITE_URL_BACKEND + "usuario", conta, {
            headers: {
              'Authorization': `Bearer ${this.token}`
            },
          })
        ).data;
        if (response.error) {
          return response;
        }
        console.log(response);

        this.conta = await response.response.response;
        this.contas.push(this.conta);
        return response.response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async atualizarConta(conta: any)
    {
      try {
        const response = (
          await axios.patch(import.meta.env.VITE_URL_BACKEND + "usuario/" + conta._id, conta, {
            headers: {
              'Authorization': `Bearer ${this.token}`
            },
          })
        );
        if (response) {
          return response;
        }
        console.log(response);

        this.getAllContas()
        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async verificarSessao(conta: any) {
      try {
        const response = (
          await axios.post(
            import.meta.env.VITE_URL_BACKEND + "usuario/login-teste",
            conta, {
              headers: {
                'Authorization': `Bearer ${this.token}`
              },
            })
          ).data;
        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async acoes(data: any) {

      switch (data.type) {
        case "create":
            this.getAllContas();
          break;

        case "update":
            console.log("update conta");
          break;

        case "delete":
            console.log("delete conta");
          break;

        default:
          console.log("Tipo desconhecido: ", data);
          break;
      }
    },
  },
});
