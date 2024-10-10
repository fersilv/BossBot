// Utilities
import { defineStore } from 'pinia'
import { useContasStore } from './contas'
import { useServicosStore } from './servicos'
import { usePedidosStore } from './pedidos'
import { useIndexStore } from '.'
import axios from 'axios'

export const useAppStore = defineStore('app', {
  state: () => ({
      isOn: false,
      isAuth: false,
      isLoading: false,
      googleIa: null,
      token: null as any,
  }),
  actions: {
    async login(conta:any) {
      try{
        const token = (await axios.post(import.meta.env.VITE_URL_BACKEND + "conta/auth", {
          usuario: conta.usuario,
          senha: conta.senha
        })).data

        if(token.access_token){
          this.token = token.access_token
          this.isAuth = true
          // seta o token no localStorage
          if(conta.remember){
          localStorage.setItem("token", token.access_token)
          }
        }
      } catch (error){
        const message = error.response.data
        console.log(message)
        throw message
      } 
    },

    async getAllContents() {
      const indexStore = useIndexStore()
      const contasStore = useContasStore()
      const servicosStore = useServicosStore()
      const pedidosStore = usePedidosStore()

      try{
      await indexStore.getTarefas()
      await contasStore.getAllContas()
      await servicosStore.getAllServicos()
      await pedidosStore.getAllPedidos()
      } catch (error)
      {
        console.log("Erro em App: ",error)
        this.isAuth = false
      }
    },
    setIsOn(state: boolean) {
      this.isOn = state
    },
    checkAuth() {
      // verifica se existe um token no localStorage
      if (localStorage.getItem("token")) {
        this.token = localStorage.getItem("token")
        this.isAuth = true
      }
      else {
        this.isAuth = false
      }
    },
    setIsLoading(state: boolean) {
      this.isLoading = state
    },
  }
})
