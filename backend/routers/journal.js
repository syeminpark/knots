import express from 'express';
import auth from '../middleware/auth.js'
import journalController from '../controller/journal.js';

const router = express.Router();

router
    .get('/getAllJournalBooks', auth, journalController.getAllData)
    .post('/createJournalBook', auth, journalController.createJournalBook)
    .post('/createComment', auth, journalController.createComment)
    .post('/createComments', auth, journalController.createComments)
    .put('/editJournalEntry/:journalEntryUUID', auth, journalController.editJournalEntry)
    .put('/editComment/:commentUUID', auth, journalController.editComment)
    .delete('/deleteComment/:commentUUID', auth, journalController.deleteComment)
    .delete('/deleteJournalEntry/:journalEntryUUID', auth, journalController.deleteJournalEntry)
    .delete('/deleteJournalEntryByOwnerUUID/:ownerUUID', auth, journalController.deleteAllJournalEntriesByOwnerUUID)

export default router;