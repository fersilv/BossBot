// Utilities
import axios from "axios";
import { defineStore } from 'pinia'

export const usePedidosStore = defineStore('pedidos', {
  state: () => ({
      pedidos: [] as any,
      pedido: 0,
  }),
  actions: {
    async getAllPedidos() {

      try {
          const response = (
            await axios.get(import.meta.env.VITE_URL_BACKEND + "pedido")
          ).data;
  
          if (this.pedidos.length == 0) {
            // Se ainda não tem nenhum pedido, atribui o response inteiro
            this.pedidos = await response;
          } else {
            // verifica se aquela conta já existe para evitar duplicatas ou atualizar os dados
            response.forEach((item: any) => {
              const existingPedido = this.pedidos.find(
                (pedido: any) => pedido._id == item._id
              );
  
              if (existingPedido) {
                // Se o pedido já existe, atualiza os dados
                Object.assign(existingPedido, item);
              } else {
                // Se o pedido não existe, adiciona ao array
                this.pedidos.push(item);
                this.pedido++;
              }
            });
          }

      } catch (error) {
          console.log(error);
      }
  },  

    async atualizarComentario(id:any,status:any,comment:boolean)
    {
      const data = {id: id ,status : status,comentario:comment};
      console.log(data)
      try {
        const response = (
          await axios.patch(import.meta.env.VITE_URL_BACKEND + "pedido/comentario", data)
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
              this.getAllPedidos();
              this.pedido++;
            break;
  
          case "update":
            this.getAllPedidos();
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

  }
})
