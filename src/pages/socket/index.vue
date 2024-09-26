<template>
    <div>
      <!-- Seu template aqui -->
    </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  
  export default {
    name: "Index",
    data() {
      return {
        socket: null,
      };
    },
    created() {
      // Conecta ao servidor Socket.IO
      this.socket = io('http://localhost:3000');
  
      // Adiciona handlers para eventos Socket.IO
      this.socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
        // Enviar uma mensagem para o servidor
        this.socket.emit('createSocket', 'Hello Server!');
      });
  
      // Escuta por mensagens do servidor
      this.socket.on('response', (data) => {
        console.log('Response from server:', data);
      });
  
      this.socket.on('disconnect', () => {
        console.log('Socket.IO connection closed');
      });
  
      this.socket.on('error', (error) => {
        console.error('Socket.IO error:', error);
      });
    },
    beforeDestroy() {
      // Certifique-se de fechar a conexão Socket.IO quando o componente for destruído
      if (this.socket) {
        this.socket.disconnect();
      }
    },
  };
  </script>
  