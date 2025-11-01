import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true, // add this if your backend uses cookies/auth
});
