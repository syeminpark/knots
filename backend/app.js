import cors from 'cors';
import express from 'express';
import "./utils/mongo.js"
import { Server } from 'socket.io';
import http from 'http';

import userRouter from "./routers/user.js"
import characterRouter from "./routers/character.js"
import journalRouter from "./routers/journal.js"
import imageRouter from "./routers/image.js"
import llmRouter from './routers/llm.js'

const PORT = process.env.PORT || 3000;
const app = express();

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*', // Allow any origin
//   },
//   maxHttpBufferSize: 1e6,  // Increase the buffer size to 1 MB (default is 1 MB)
//   transports: ['websocket', 'polling'],  // Enable both WebSocket and polling
// });

// io.on('connection', (socket) => {
//   console.log('A user connected: ' + socket.id);
//   socket.on('disconnect', () => {
//     console.log('User disconnected: ' + socket.id);
//   });
// });



app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase the JSON payload size limit to 50MB
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increase URL-encoded payload size limit
app.use(userRouter);
app.use(characterRouter);
app.use(journalRouter)
app.use(imageRouter)
app.use(llmRouter)

// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT} and on your local network at http://192.168.0.19:${PORT}`);
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} and on your local network at http://192.168.0.19:${PORT}`);
});

// export { io };