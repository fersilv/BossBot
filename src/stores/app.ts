// Utilities
import { defineStore } from "pinia";
import { useContasStore } from "./contas";
import { useServicosStore } from "./servicos";
import { usePedidosStore } from "./pedidos";
import { useIndexStore } from ".";
import axios from "axios";

export const useAppStore = defineStore("app", {
  state: () => ({
    isOn: false,
    isAuth: false,
    isLoading: true,
    googleIa: null,
    token: null as any,
    loadingContents: false,
  }),
  actions: {
    async login(conta: any) {
      try {
        const token = (
          await axios.post(import.meta.env.VITE_URL_BACKEND + "conta/auth", {
            usuario: conta.usuario,
            senha: conta.senha,
          })
        ).data;

        if (token.access_token) {
          this.token = token.access_token;
          this.isAuth = true;
          // seta o token no localStorage
          if (conta.remember) {
            localStorage.setItem("token", token.access_token);
          }
        }
      } catch (error) {
        const message =
          error.response.data ?? new Error("Ocorreu um erro inesperado");
        console.log(message);
        throw message;
      }
    },

    async getAllContents() {
      if (this.loadingContents) return;
      this.loadingContents = true;
      this.isLoading = true;
      const indexStore = useIndexStore();
      const contasStore = useContasStore();
      const servicosStore = useServicosStore();
      const pedidosStore = usePedidosStore();

      try {
        await indexStore.getTarefas();
        await contasStore.getAllContas();
        await servicosStore.getAllServicos();
        await pedidosStore.getAllPedidos();
      } catch (error) {
        console.log("Erro em App: ", error);
        this.isAuth = false;
      }
      this.isLoading = false;
      this.loadingContents = false;
    },
    setIsOn(state: boolean) {
      this.isOn = state;
    },

    async checkAuth() {
      this.isLoading = true;
      const token = localStorage.getItem("token");

      // Verifica se existe um token salvo
      if (token) {
        try {
          // Envia o token para o backend para validar
          await axios.post(
            import.meta.env.VITE_URL_BACKEND + "validate-token",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Se a resposta for bem-sucedida, o token é válido
          this.token = token;
          this.isAuth = true;
          this.getAllContents();
        } catch (error) {
          // Se o token for inválido, remova do localStorage
          console.warn("Token inválido. Realizando logout...", error);
          // localStorage.removeItem("token");
          this.isAuth = false;
          this.isLoading = false;
        }
      } else {
        // Se não houver token, não está autenticado
        this.isAuth = false;
        this.isLoading = false;
      }
    },

    setIsLoading(state: boolean) {
      this.isLoading = state;
    },
  },
});
