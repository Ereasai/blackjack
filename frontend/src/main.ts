import "./style.css";

const status = document.querySelector<HTMLElement>("#status")!;
const sendButton = document.querySelector<HTMLButtonElement>("#send")!;
const latestMessage = document.querySelector<HTMLOutputElement>("#message")!;

const backendUrl =
  import.meta.env.VITE_BACKEND_WS_URL ?? "ws://localhost:8787/ws";
const socket = new WebSocket(backendUrl);

socket.addEventListener("open", () => {
  status.textContent = "connected";
  status.dataset.state = "connected";
  sendButton.disabled = false;
});

socket.addEventListener("message", (event) => {
  latestMessage.textContent = String(event.data);
});

socket.addEventListener("close", () => {
  status.textContent = "disconnected";
  status.dataset.state = "disconnected";
  sendButton.disabled = true;
});

socket.addEventListener("error", () => {
  status.textContent = "connection error";
  status.dataset.state = "disconnected";
});

sendButton.addEventListener("click", () => {
  socket.send("hello");
});
