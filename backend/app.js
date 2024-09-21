import cors from 'cors';
import express from 'express';
import "./mongo.js"

import userRouter from "./routers/user.js"
import characterRouter from "./routers/character.js"
import journalRouter from "./routers/journal.js"

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(userRouter);
app.use(characterRouter);
app.use(journalRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


