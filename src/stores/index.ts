// Utilities
import axios from "axios";
import { createPinia, defineStore } from 'pinia'

export default createPinia()

export const useIndexStore = defineStore('index',{
    state: () => ({
        tarefas: {} as any,
    }),
    actions: {
        async getTarefas(){
            try {
                await axios.get(import.meta.env.VITE_URL_BACKEND + "v1/tarefas")
              } catch (error) {
                console.log(error);
              }
        }
    }
})
