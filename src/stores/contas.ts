import axios from "axios";
import { defineStore } from "pinia";

export const useContasStore = defineStore("contas", {
  state: () => ({
    contas: [] as any,
    conta: {},
  }),
  actions: {
    async getAllContas() {
      try {
        const response = (
          await axios.get(import.meta.env.VITE_URL_BACKEND + "conta")
        ).data;
        if (this.contas.length == 0) {
          this.contas = await response;
        } else {
          // verifica se aquela conta já existe para evitar duplicatas
          response.forEach((item: any) => {
            if (!this.contas.find((conta: any) => conta.id == item.id)) {
              this.contas.push(item);
            }
          });
        }
        console.log(
          import.meta.env.VITE_URL_BACKEND + "conta",
          "Response: ",
          response
        );
      } catch (error) {
        console.log(error);
      }
    },

    async cadastrarConta(conta: any) {
      try {
        const response = (
          await axios.post(import.meta.env.VITE_URL_BACKEND + "conta", conta)
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

    async verificarSessao(conta: any) {
      try {
        const response = (
          await axios.post(
            import.meta.env.VITE_URL_BACKEND + "conta/login-teste",
            conta
          )
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
