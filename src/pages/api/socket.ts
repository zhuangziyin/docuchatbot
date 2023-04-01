import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer, Socket as IOSocket } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as HttpServer } from "http";
import { Http2SecureServer } from "http2";
import { split } from "./utils/split";
import { OneTimeAppend } from "@/MarkdownProcessor";
import FileOps from "./utils/FileOps";
export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: Http2SecureServer & {
      io: SocketIOServer;
    };
  };
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    const httpServer: Http2SecureServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: "/api/socket",
    });
    io.on("connection", (socket: IOSocket) => {
      console.log("New client connected");
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
      socket.on("testApi", (data: string) => {
        socket.emit("testApiCallback", data + " Received.!!");
      });
      socket.on("split", (data: string, fn: (arr: OneTimeAppend[]) => void) => {
        fn(split(data));
      });
    });
    res.socket.server.io = io;
  }
  res.send("Socket is running");
  res.end();
};

export default SocketHandler;
