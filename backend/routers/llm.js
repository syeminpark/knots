import express from 'express';
import auth from '../middleware/auth.js'
import llmController from '../controller/llm.js';

const router = express.Router()

router
    .post('/createLLMJournalEntries', auth, llmController.onCreateJournalEntries)
    .post('/createLLMComment', auth, llmController.onCreateComment)
    .post('/createLLMStranger', auth, llmController.onCreateStranger)

export default router; 