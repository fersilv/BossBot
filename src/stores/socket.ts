import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { useContasStore } from "./contas";
import { useAppStore } from "./app";
import { useServicosStore } from "./servicos";
import { usePedidosStore } from "./pedidos";

// Definindo o tipo de evento padrão
type DefaultEventsMap = {
  connect: () => void;
  response: (data: any) => void;
  disconnect: () => void;
  error: (error: any) => void;
};

export const useSocketStore = defineStore("socket", {
  state: () => ({
    socket: null as Socket<DefaultEventsMap> | null,
    socketServer: null as Socket<DefaultEventsMap> | null,
    connected: false,
    response: null as any,
    error: null as any,
    action: null as any,
    tarefas: {} as any,
  }),
  actions: {
    connect() {
      if (this.socket) {
        //console.warn("Socket already connected");
        return;
      }

      this.socketServer = io("https://bossbot.tunn.dev", {
        transports: ["websocket"],
      });

      this.socketServer.on("connect", () => {
        this.connected = true;
      });

      this.socketServer.on("disconnect", () => {
        console.log("SocketServer.IO connection closed");
        this.connected = false;
      });

      this.socket = io(import.meta.env.VITE_URL_BACKEND_SOCKET, {
        transports: ["websocket"],
      });

      this.socket.on("connect", () => {
        //console.log("Connected to Socket.IO server");
        const appStore = useAppStore();
        appStore.getAllContents();
      });

      this.socket.on("response", (data: any) => {
        this.response = data;

        if (data.action == "refrash") {
          window.location.reload();
        }
      });

      this.socket.on("action", (data: any) => {
        this.acoes(data);
        this.action = data;
      });

      this.socket.on("googleIa", (data: any) => {
        const appStore = useAppStore();
        appStore.googleIa = data;
      });

      this.socket.on("tarefas", (data: any) => {
        try {
          this.tarefas = data;
        } catch (err) {
          this.tarefas = {
            pending: 0,
            processing: 0,
            inprogress: 0,
            error: 0,
            completed: 0,
            canceled: 0,
          };
          console.log("Erro socket: ", err);
        }
      });

      this.socket.on("disconnect", () => {
        console.log("Socket.IO connection closed");
      });

      this.socket.on("error", (error: any) => {
        console.error("Socket.IO error:", error);
        this.error = error;
      });
    },

    disconnect() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
        this.connected = false;
      }
    },

    acoes(data: any) {
      console.log("socket:", data);
      switch (data.store) {
        case "conta":
          const contasStore = useContasStore();
          contasStore.acoes(data);
          break;
        case "servico":
          const servicosStore = useServicosStore();
          servicosStore.acoes(data);
          break;
        case "pedido":
          const pedidosStore = usePedidosStore();
          pedidosStore.acoes(data);
          break;
        default:
          console.log("store desconhecido: ", data);
          break;
      }
    },
  },
});
