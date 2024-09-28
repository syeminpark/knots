import express from 'express';
import auth from '../middleware/auth.js'
import llmController from '../controller/llm.js';

const router = express.Router()

router
    .get('/getLLMJournalEntry', auth, llmController.onCreateJournalEntry)
    .get('/getLLMComment', auth, llmController.onCreateComment)
    .get('/getLLMStranger', auth, llmController.onCreateStranger)

export default router; 