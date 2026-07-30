import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || "https://dev.surrosantara.space";

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    socket.on("connect", () => {
    });

    socket.on("disconnect", () => {
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
