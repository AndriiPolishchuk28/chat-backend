import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { PORT, DB_HOST } = process.env;
const app = express();

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("chat-message", (message) => {
    socket.broadcast.emit("chat-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
