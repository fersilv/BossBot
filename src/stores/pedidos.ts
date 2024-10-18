// Utilities
import axios from "axios";
import { defineStore } from "pinia";
import { useAppStore } from "./app";

export const usePedidosStore = defineStore("pedidos", {
  state: () => ({
    pedidos: [] as any,
    pedido: 0,
    token: useAppStore().token,
    canceled: 0,
    error: 0,
  }),
  actions: {
    async getAllPedidos() {
      try {
        const response = (
          await axios.get(import.meta.env.VITE_URL_BACKEND + "pedido", {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          })
        ).data;

        console.log(response);

        // Atualiza os pedidos
        this.pedidos = await response;

        // Atualiza contadores de 'cancelado' e 'erro'
        const errorCount = this.pedidos.filter(
          (item: any) => item.status === "Error"
        ).length;
        const canceledCount = this.pedidos.filter(
          (item: any) => item.status === "Canceled"
        ).length;

        if (errorCount > this.error) {
          if (this.error > 0) {
            const audio = new Audio("/sons/pedido-erro.mp3");
            audio.play();
          }
          this.error = errorCount;
        }

        if (canceledCount > this.canceled) {
          if (this.canceled > 0) {
            const audio = new Audio("/sons/pedido-cancelado.mp3");
            audio.play();
          }
          this.canceled = canceledCount;
        }

        const inRevisionCount = this.pedidos.filter(
          (item: any) =>
            item.comments &&
            item.comments.some(
              (comment: any) => comment.statusComentario === "InRevision"
            )
        ).length;

        if (inRevisionCount > 0) {
          // Toca som para comentários aguardando revisão
          const audio = new Audio("/sons/pedido-revisao.mp3");
          audio.play();

          // Verifica se a aba está ativa
          this.sendBrowserNotification(inRevisionCount);
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    sendBrowserNotification(commentsCount: number) {
      if (Notification.permission === "granted") {
        navigator.serviceWorker.getRegistration().then(function (registration) {
          if (registration) {
            registration.showNotification("Nova tarefa", {
              body: `Existem ${commentsCount} comentários aguardando revisão.`,
              // icon: '/path/to/icon.png',
              //vibrate: [200, 100, 200],  // Para dar um feedback tátil em dispositivos móveis
              tag: "revisao-comentarios", // Evita a duplicação de notificações
            });
          }
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            navigator.serviceWorker
              .getRegistration()
              .then(function (registration) {
                if (registration) {
                  registration.showNotification("Nova Tarefa", {
                    body: `Existem ${commentsCount} comentários aguardando revisão.`,
                    // icon: '/path/to/icon.png',
                    //vibrate: [200, 100, 200],
                    tag: "revisao-comentarios",
                  });
                }
              });
          }
        });
      }
    },

    async priorizarPedidoOuCancelar(id: any, acao: any) {
      try {
        const response = (
          await axios.patch(
            import.meta.env.VITE_URL_BACKEND + "pedido/" + acao + "/" + id,
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          )
        ).data;
        console.log(response);
        return response;
      } catch (error) {
        console.log("Erro ao cancelar/Priorizar pedido", error);
      }
    },

    async atualizarComentario(id: any, status: any, comment: boolean) {
      const data = { id: id, status: status, comentario: comment };
      console.log(data);
      try {
        const response = (
          await axios.patch(
            import.meta.env.VITE_URL_BACKEND + "pedido/comentario",
            data,
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          )
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
          const audio = new Audio("/sons/novo-pedido.mp3");
          audio.play();
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
