import { io } from "socket.io-client";

const socket = io("https://skillbridge-backend-hz7v.onrender.com", {
  transports: ["websocket"],
});

export default socket;
