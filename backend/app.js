import cors from 'cors';
import express from 'express';
import "./utils/mongo.js"
import { Server } from 'socket.io';
import http from 'http';

import userRouter from "./routers/user.js"
import characterRouter from "./routers/character.js"
import journalRouter from "./routers/journal.js"
import imageRouter from "./routers/image.js"
// import llmRouter from './routers/llm.js'

const PORT = 3000;
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow any origin
  },
  transports: ['websocket', 'polling'],  // Enable both WebSocket and polling
});

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});



app.use(cors());
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(userRouter);
app.use(characterRouter);
app.use(journalRouter)
app.use(imageRouter)
// app.use(llmRouter)

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT} and on your local network at http://192.168.0.19:${PORT}`);
});

export { io };