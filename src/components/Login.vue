<template>
  <v-container class="login-container" fluid>
    <v-row justify="center" class="layoutAjustavel">
      <v-col cols="12" md="6">
        <v-card class="elevation-12 login-card">
          <v-row no-gutters>
            <!-- Coluna com o Formulário de Login -->
            <v-col cols="12" md="7" class="login-form">
              <div class="w-100 text-center">
              <v-card-title class="login-title mb-0 pb-0 mt-4"><b>BOSS</b>BOT</v-card-title>
              <v-card-subtitle class="login-subtitle">ENTRE</v-card-subtitle>
            </div>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="usuario" 
                    label="Usuário"
                    prepend-inner-icon="mdi-account"
                    type="text"
                    class="input-field"
                    variant="solo"
                    color="primary"
                    required
                    rounded
                    @keyup.enter="$refs.senhaInput.focus()"
                  ></v-text-field>

                  <v-text-field
                    v-model="senha"
                    ref="senhaInput"
                    label="Senha"
                    prepend-inner-icon="mdi-lock"
                    type="password"
                    class="input-field"
                    variant="solo"
                    color="primary"
                    @keyup.enter="login"
                    required
                    rounded
                  ></v-text-field>

                  <v-alert v-if="error" type="error" style="font-size: 12px;" variant="plain" color="warning" class="py-0" closable>{{ error }}</v-alert> 

                  <v-switch
                    v-model="remember"
                    label="Permanecer Conectado"
                    class="toggle-field"
                    color="blue darken-1"
                  ></v-switch>

                  <v-btn class="login-btn" large @click="login" :loading="loading">
                    Entrar
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-col>

            <!-- Coluna com a Imagem -->
            <v-col cols="12" md="5" class="login-image">
              <div class="bossbot-image"></div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Ícones de redes sociais flutuantes fora do card -->
    <v-icon
      v-for="(icon, index) in icons"
      :key="index"
      :class="`social-icon mdi ${icon}`"
      :style="getRandomPosition()"
    ></v-icon>
  </v-container>
</template>

<script>
import { useAppStore } from '@/stores/app';

export default {
  data() {
    return {
      remember: false,
      usuario: '',
      senha: '',
      icons: [
        'mdi-facebook', 'mdi-twitter', 'mdi-instagram', 'mdi-youtube', 'mdi-tiktok', 'mdi-whatsapp', 
        'mdi-linkedin', 'mdi-reddit', 'mdi-snapchat', 'mdi-pinterest', 'mdi-discord', 'mdi-facebook', 
        'mdi-twitter', 'mdi-instagram', 'mdi-youtube', 'mdi-tiktok', 'mdi-whatsapp'
      ],
      error: '',
      loading: false
    };
  },
  methods: {
    async login() {
      console.log("entrou")
      this.loading = true;

      if(this.usuario == '' || this.senha == '') {
        this.error = 'Preencha todos os campos';
        this.loading = false;
        return;
      }
      this.error = "";

      try {
        const appStore = useAppStore();
        const conta = {
          usuario: this.usuario,
          senha: this.senha,
          remember: this.remember
        }
        const response = await appStore.login(conta);
        this.loading = false;
      } catch (error) {

        console.log(error)
        this.error = await error.message;
        this.loading = false;
      }
    },
    getRandomPosition() {
      // Gera posições aleatórias e tempos de animação aleatórios
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;
      const randomDelay = Math.random() * 10 + 's';
      const randomDuration = Math.random() * 5 + 5 + 's'; // duração entre 5s a 10s
      return {
        top: randomY + '%',
        left: randomX + '%',
        animationDelay: randomDelay,
        animationDuration: randomDuration,
        zIndex: -1, // Mantém os ícones no fundo
      };
    },
  },
};
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

html,
body,
main{
  height: 100vh!important;
  min-height: 100vh!important;
  max-height: 100vh!important;
  overflow: hidden!important;
} 

#app{
  overflow: initial!important;
  height: 100vh!important;
  min-height: 100vh!important;
  max-height: 100vh!important;
  z-index: 9999!important;
}

.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    #20222a,
    #000004
  ); /* Fundo escuro seguindo o tema dark */
  position: relative;
  overflow: hidden;
}

.login-card {
  background: rgba(0, 0, 0, 0.137);
  border-radius: 20px 0;
  backdrop-filter: blur(20px);
  box-shadow: inset 0 0 0px 2px #00bbff !important;
  overflow: hidden;
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 20px;
}

.login-form {
  padding: 60px;
  color: #e0e0e0;
}

.login-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #00bbff;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  font-style: normal;
}

.login-title > b {
  color: white;
  font-family: "Poppins", sans-serif;
  font-weight: 800;
  font-style: normal;
}

.login-subtitle {
  font-size: 14px;
  margin-bottom: 20px;
  color: #b0bec5; /* Cinza claro */
}

.input-field {
  color: #ffffff;
  border-radius: 10px;
}

.login-btn {
  width: 100%;
  background: linear-gradient(90deg, #003e54, #00bbff);
  color: #fff;
  font-size: 18px;
  border-radius: 25px;
  transition: transform 0.3s;
}

.login-btn:hover {
  transform: scale(1.05);
}

.toggle-field {
  margin-top: 10px;
  color: #b0bec5;
}

/* Ajuste da imagem do BossBot para ser cover */
.bossbot-image {
  background-image: url("/public/bossbot1.jpeg"); /* Caminho para sua imagem */
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 100%;
  border-radius: 10px 0;
}

.social-icon {
  position: absolute;
  font-size: 25px;
  color: rgba(255, 255, 255, 0.4);
  animation: float 10s infinite ease-in-out, fade-in-out 8s infinite;
  z-index: -1; /* Ícones no fundo */
}

@media screen and (max-width: 500px) {
  .layoutAjustavel {
    height: 100%;
  }
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes fade-in-out {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
