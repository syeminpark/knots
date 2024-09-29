import express from 'express';
import auth from '../middleware/auth.js'
import llmController from '../controller/llm.js';

const router = express.Router()

router
    .post('/createLLMJournalEntries', auth, llmController.onCreateJournalEntries)
    .post('/createLLMComments', auth, llmController.onCreateComments)
    .post('/createLLMStranger', auth, llmController.onCreateStranger)

export default router; 