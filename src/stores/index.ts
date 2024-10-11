// Utilities
import axios from "axios";
import { createPinia, defineStore } from 'pinia'
import { useAppStore } from "./app";

export default createPinia()

export const useIndexStore = defineStore('index',{
    state: () => ({
        tarefas: {} as any,
        token: useAppStore().token
    }),
    actions: {
        async getTarefas(){
            try {
                await axios.get(import.meta.env.VITE_URL_BACKEND + "v1/tarefas", {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    },
                })
              } catch (error) {
                console.log(error);
                throw error
              }
        }
    }
})
