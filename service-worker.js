self.addEventListener("install", function (event) {
  console.log("Service Worker instalado.");
});

self.addEventListener("push", function (event) {
  const data = event.data ? event.data.text() : "Sem dados de push";
  const options = {
    body: data, // Corpo da notificação
    vibrate: [200, 100, 200], // Vibração (opcional)
    tag: "revisao-comentarios", // Identificador único para evitar notificações duplicadas
  };

  event.waitUntil(
    self.registration.showNotification("Título da Notificação", options)
  );
});
