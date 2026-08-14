export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);

    if (url.pathname !== "/ws") {
      return new Response("blackjack backend is running");
    }

    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const [client, server] = Object.values(new WebSocketPair());

    server.accept();
    server.addEventListener("message", (event) => {
      server.send(`echo: ${String(event.data)}`);
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  },
} satisfies ExportedHandler;
