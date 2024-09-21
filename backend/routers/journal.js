import express from 'express';
import auth from '../middleware/auth.js'
import journalController from '../controller/journal.js';

const router = express.Router();

router
    .delete('/journalEntries/:journalEntryUUID', auth, journalController.deleteJournalEntry)
    .post('/comments', auth, journalController.createComment)
    .post('/journalBooks', auth, journalController.createJournalBook)
    .put('/journalEntries/:journalEntryUUID', auth, journalController.editJournalEntry)
    .put('/comments/:commentUUID', auth, journalController.editComment)
    .delete('/comments/:commentUUID', auth, journalController.deleteComment)
    .get('/allData', auth, journalController.getAllData);

export default router;

