// Utilities
import axios from "axios";
import { defineStore } from "pinia";
import { useAppStore } from "./app";

export const usePedidosStore = defineStore("pedidos", {
  state: () => ({
    pedidos: [] as any,
    pedido: 0,
    token: useAppStore().token,
  }),
  actions: {
    async getAllPedidos() {
      try {
        const response = (
          await axios.get(import.meta.env.VITE_URL_BACKEND + "pedido", {
            headers: {
              'Authorization': `Bearer ${this.token}`
            },
          })
        ).data;

        this.pedidos = await response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async priorizarPedidoOuCancelar(id:any,acao:any)
    {
      try {
        const response = (
          await axios.patch(import.meta.env.VITE_URL_BACKEND + "pedido/" + id + "/" + acao, {
            headers: {
              'Authorization': `Bearer ${this.token}`
            },
          })
        ).data;
        console.log(response)
        return response;
      } catch (error) {
        console.log("Erro ao cancelar/Priorizar pedido",error);
      }
    },

    async atualizarComentario(id: any, status: any, comment: boolean) {
      const data = { id: id, status: status, comentario: comment };
      console.log(data);
      try {
        const response = (
          await axios.patch(
            import.meta.env.VITE_URL_BACKEND + "pedido/comentario",
            data, {
              headers: {
                'Authorization': `Bearer ${this.token}`
              },
            })
          ).data;
        if (response.error) {
          return response;
        }

        // acha o pedido e atualiza
        const index = this.pedidos.findIndex((item: any) => item._id === id);
        if (index !== -1) {
          this.pedidos[index] = response;
        }
        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async acoes(data: any) {
      switch (data.type) {
        case "create":
          await this.getAllPedidos();
          this.pedido++;
          break;

        case "update":
          console.log("update pedido", data);
          await this.getAllPedidos();
          this.pedido++;
          break;

        case "delete":
          console.log("delete pedido");
          break;

        default:
          console.log("Tipo desconhecido: ", data);
          break;
      }
    },
  },
});
