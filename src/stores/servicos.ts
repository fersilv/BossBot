import axios from "axios";
import { defineStore } from "pinia";

export const useServicosStore = defineStore("servicos", {
  state: () => ({
    servicos: [] as any,
    servico: {},
    redesSociais: [] as any,
    tipoServico: [] as any,
  }),
  actions: {
    async createServico(data: any) {
      try {
        const response = (
          await axios.post(import.meta.env.VITE_URL_BACKEND + "servico", data)
        ).data;
        if (response.error) {
          return response;
        }

        console.log(response);

        console.log(
          import.meta.env.VITE_URL_BACKEND + "servico",
          "Response: ",
          response
        );

        return response;
      } catch (error) {
        console.log(error);
      }
    },
    async getAllServicos() {
      try {
        const response = (
          await axios.get(import.meta.env.VITE_URL_BACKEND + "servico/findAll")
        ).data;
        this.servicos = await response;
        this.servico = await response[0];
        // console.log("Serviços: ",response)
        // if (this.servicos.length == 0) {
        //   this.servicos = await response;
        //   this.servico = await response[0];
        // } else {
        //   // verifica se aquela conta já existe para evitar duplicatas
        //   response.forEach((item: any) => {
        //     if (
        //       !this.servicos.find((servico: any) => servico._id == item._id)
        //     ) {
        //       this.servicos.push(item);
        //       this.servico = item;
        //     } else {
        //       this.servicos.forEach((servico: any) => {
        //         if (servico._id == item._id) {
        //           servico = item;
        //         }
        //       });
        //     }
        //   });
        // }
        try {
          const rs = (
            await axios.get(
              import.meta.env.VITE_URL_BACKEND + "servico/categories"
            )
          ).data;
          this.redesSociais = rs;
        } catch (err) {
          console.log(err);
        }

        try {
          const ts = (
            await axios.get(
              import.meta.env.VITE_URL_BACKEND + "servico/typeService"
            )
          ).data;
          this.tipoServico = ts;
        } catch (err) {
          console.log(err);
        }


      } catch (error) {
        console.log(error);
      }
    },

    async updateServico(data: any) {
      try {
        const response = (
          await axios.patch(
            import.meta.env.VITE_URL_BACKEND + "servico/" + data._id,
            data
          )
        ).data;
        if (response.error) {
          return response;
        }

        console.log("Patch response: ", response);
      } catch (error) {}
    },

    async updateServicoAssociadosPerfil(id: any, users: any) {
      const usuarios = { usuarios: users };
      try {
        const response = (
          await axios.patch(
            import.meta.env.VITE_URL_BACKEND + "servico/" + id + "/usuarios",
            usuarios
          )
        ).data;
        if (response.error) {
          return response;
        }
        // remove o servico do array de servicos e chama o getAll de novo
        const index = this.servicos.findIndex(
          (item: any) => item._id === id
        );

       await this.getAllServicos();
      } catch (error) {}
    },

    async removeContaServico(servicoId: any, contaId: any) {
      try {
        const response = (
          await axios.delete(
            import.meta.env.VITE_URL_BACKEND +
              "servico/" +
              servicoId +
              "/usuario/" +
              contaId
          )
        ).data;
        if (response.error) {
          return response;
        }
      } catch (error) {
        throw error;
      }
    },

    async updateStoreServico(servico: any) {
      // Encontre o índice do serviço na lista e atualize
      const index = this.servicos.findIndex(
        (item: any) => item._id === servico._id
      );
      if (index !== -1) {
        // Atualiza o serviço existente
        this.servicos[index] = servico;
      }
      // se nao achar, remove
      else {
        const index = this.servicos.findIndex(
          (item: any) => item._id === servico._id
        );
        if (index !== -1) {
          this.servicos.splice(index, 1);
        }
      }
      // Atualiza o serviço atual
      this.servico = servico;
    },

    async removeContaStore(idServico: any, idConta: any) {
      const index = this.servicos.findIndex(
        (item: any) => item._id === idServico
      );
      if (index !== -1) {
        this.servicos[index].usuarios = this.servicos[index].usuarios.filter(
          (item: any) => item._id !== idConta
        );
      }

      this.servico = true;
    },

    async acoes(data: any) {
      switch (data.type) {
        case "create":
          this.getAllServicos();
          break;
        case "update":
          await this.getAllServicos()
          this.updateStoreServico(data.data);
          break;
        case "delete":
          await this.getAllServicos()
          this.removeContaStore(data.data.idServico, data.data.idConta);
          break;
        default:
          this.servicos = [];
          this.getAllServicos();
          break;
      }
    },
  },
});
