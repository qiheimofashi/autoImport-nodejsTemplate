// Create WebSocket connection.
import { CreateWebSocket } from "/utils/request.js";

const webSocket = new CreateWebSocket(
  `ws://${window.location.host}/websocketApi/devUpdate`,
  {
    canvasId: window.$canvasId,
  },
);

webSocket.addTask((event) => {
  if (JSON.parse(event).fileName) {
    window.location.reload();
  }
});
