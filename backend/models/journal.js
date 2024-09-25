import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Comment Schema
const commentSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true, default: () => uuidv4() },
    commentThreadUUID: { type: String, required: true },
    ownerUUID: { type: String, required: true },
    userUUID: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    selectedMode: { type: String },
    isDeleted: { type: Boolean, required: true, default: false },  // Add isDeleted field for soft delete
    history: {
        type: [
            {
                previousContent: { type: String },
                editedAt: { type: Date, default: Date.now },
            }
        ],
        default: []
    },
});
const Comment = mongoose.model('Comment', commentSchema);

// CommentThread Schema
const commentThreadSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true, default: () => uuidv4() },
    journalEntryUUID: { type: String, required: true },
    userUUID: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, required: true, default: false },  // Add isDeleted field for soft delete
});
const CommentThread = mongoose.model('CommentThread', commentThreadSchema);

// JournalEntry Schema
const journalEntrySchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true, default: () => uuidv4() },
    journalBookUUID: { type: String, required: true },
    userUUID: { type: String, required: true },
    ownerUUID: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, required: true, default: false },  // Add isDeleted field for soft delete
    history: {
        type: [
            {
                previousContent: { type: String },
                editedAt: { type: Date, default: Date.now },
            }
        ],
        default: []
    },
});
const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

// JournalBook Schema
const journalBookSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true, default: () => uuidv4() },
    title: { type: String, required: true },
    selectedMode: { type: String },
    createdAt: { type: Date, default: Date.now },
    userUUID: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },  // Add isDeleted field for soft delete
});
const JournalBook = mongoose.model('JournalBook', journalBookSchema);
export { Comment, CommentThread, JournalEntry, JournalBook };
