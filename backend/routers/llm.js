import express from 'express';
import auth from '../middleware/auth.js'
import llmController from '../controller/llm.js';

const router = express.Router()

    .get('/getLLMJournalEntry', llmController.onGetJournalEntry)
    .get('/getLLMComment', llmController.onGetComment)
    .get('/getLLMStranger', llmController.onGetStranger)

export default router; 