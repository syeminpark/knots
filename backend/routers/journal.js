import express from 'express';
import auth from '../middleware/auth.js'
import journalController from '../controller/journal.js';

const router = express.Router();

router
    .get('/allData', auth, journalController.getAllData)
    .post('/journalBooks', auth, journalController.createJournalBook)
    .post('/comments', auth, journalController.createComment)
    .put('/journalEntries/:journalEntryUUID', auth, journalController.editJournalEntry)
    .put('/comments/:commentUUID', auth, journalController.editComment)
    .delete('/comments/:commentUUID', auth, journalController.deleteComment)
    .delete('/journalEntries/:journalEntryUUID', auth, journalController.deleteJournalEntry)

export default router;

