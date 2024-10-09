// Utilities
import { defineStore } from 'pinia'
import { useContasStore } from './contas'
import { useServicosStore } from './servicos'
import { usePedidosStore } from './pedidos'
import { useIndexStore } from '.'

export const useAppStore = defineStore('app', {
  state: () => ({
      isOn: false,
      isAuth: false,
      isLoading: false,
      googleIa: null,
  }),
  actions: {
    async getAllContents() {
      const indexStore = useIndexStore()
      const contasStore = useContasStore()
      const servicosStore = useServicosStore()
      const pedidosStore = usePedidosStore()

      await indexStore.getTarefas()
      await contasStore.getAllContas()
      await servicosStore.getAllServicos()
      await pedidosStore.getAllPedidos()
    },
    setIsOn(state: boolean) {
      this.isOn = state
    },
    setIsAuth(state: boolean) {
      this.isAuth = state
    },
    setIsLoading(state: boolean) {
      this.isLoading = state
    },
  }
})
