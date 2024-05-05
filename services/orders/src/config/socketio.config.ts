import { Server } from "http";
import * as socket from "socket.io";

let io: socket.Server;

const initializeSocket = (httpServer: Server) => {
  io = new socket.Server(httpServer);

  io.on("connection", (socket) => {
    console.log("client connected ");
    
    socket.on("disconnect", () => {
      console.log("client disconnected");
    });
  });
};

export { io, initializeSocket };
