// Utilities
import { defineStore } from 'pinia'
import { useContasStore } from './contas'
import { useServicosStore } from './servicos'

export const useAppStore = defineStore('app', {
  state: () => ({
      isOn: false,
      isAuth: false,
      isLoading: false,
  }),
  actions: {
    async getAllContents() {
      const contasStore = useContasStore()
      const servicosStore = useServicosStore()

      await contasStore.getAllContas()
      await servicosStore.getAllServicos()
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
