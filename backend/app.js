import cors from 'cors';
import express from 'express';
import "./mongo.js"

import userRouter from "./routers/user.js"

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// import path from 'path'
// import {
//     fileURLToPath
// } from 'url';
// import {
//     dirname
// } from 'path';

// const __filename = fileURLToPath(
//     import.meta.url);
// const __dirname = dirname(__filename);

// app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 제공 경로 설정


