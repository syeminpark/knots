//방법 1: 나중에 Server없이 배포할 것을 생각하고, 이걸 최대한 바꾸지 않을가?
//근데 너무 비효율적으로 맞추는 것은 애바세바. 
//나중에도 그냥 객체를 만들어서 넣으면 될 것 같기도하고 


// useSocketListeners.js
import { useEffect } from 'react';
import socket from './socketService'


const useSocketListeners = (dispatchCreatedCharacters, dispatchCreatedJournalBooks, setPanels) => {


    useEffect(() => {
        // Listen for character creation event from the server
        socket.on('characterCreated', (character) => {

            dispatchCreatedCharacters({
                type: 'CREATE_CHARACTER',
                payload: {
                    name: character.name,
                    personaAttributes: character.personaAttributes,
                    connectedCharacters: character.connectedCharacters,
                    imageSrc: character.imageSrc,
                    uuid: character.uuid,
                }
            });

        });

        // Listen for character updates
        socket.on('characterUpdated', (character) => {
            dispatchCreatedCharacters({
                type: 'EDIT_CREATED_CHARACTER',
                payload: {
                    name: character.name,
                    personaAttributes: character.personaAttributes,
                    connectedCharacters: character.connectedCharacters,
                    imageSrc: character.imageSrc,
                    uuid: character.uuid,
                }
            });
        });

        // Listen for character deletion
        socket.on('characterDeleted', ({ uuid }) => {
            setPanels([])
            dispatchCreatedCharacters({
                type: 'DELETE_CHARACTER',
                payload: { uuid },
            });
        });

        socket.on('charactersReordered', ({ characters }) => {
            dispatchCreatedCharacters({
                type: 'REORDER_CHARACTERS',
                payload: characters
            });
        });

        /*
        */

        // Listen for journal book creation
        //This is for manually created books.
        //Later lets modify this to incorproate the changes for generated and possibly just pass the book and entires
        socket.on('journalBookCreated', ({ journalBook, journalEntries }) => {
            console.log(journalBook)
            console.log(journalEntries)

            dispatchCreatedJournalBooks({
                type: 'CREATE_JOURNAL_BOOK',
                payload: {
                    uuid: journalBook.uuid,
                    journalBookTitle: journalBook.title,
                    selectedMode: journalBook.selectedMode,
                    journalEntries: journalEntries,
                    createdAt: journalBook.createdAt,
                }
            });
        });

        // Listen for journal entry updates
        socket.on('journalEntryUpdated', (journalEntry) => {
            console.log(journalEntry.content)
            dispatchCreatedJournalBooks({
                type: 'EDIT_JOURNAL_ENTRY',
                payload: {
                    journalBookUUID: journalEntry.journalBookUUID,
                    journalEntryUUID: journalEntry.uuid,
                    newValue: journalEntry.content,
                }
            });
        });

        // Listen for journal entry deletion
        socket.on('journalEntryDeleted', ({ journalEntryUUID, journalBookUUID }) => {
            setPanels([])
            dispatchCreatedJournalBooks({
                type: 'DELETE_JOURNAL_ENTRY',
                payload: { journalEntryUUID, journalBookUUID }
            });
        });

        socket.on('journalEntriesDeleted', ({ ownerUUID }) => {
            setPanels([])

            dispatchCreatedJournalBooks({
                type: 'DELETE_JOURNAL_ENTRY_OWNER_UUID',
                payload: { ownerUUID }
            });
        });

        // Listen for comment or comment thread creation
        socket.on('commentCreated', ({ journalEntry, newComment }) => {
            dispatchCreatedJournalBooks({
                type: 'CREATE_COMMENT',
                payload: {
                    journalBookUUID: journalEntry.journalBookUUID,
                    journalEntryUUID: journalEntry.uuid,
                    commentThreadUUID: newComment.commentThreadUUID,
                    commentUUID: newComment.uuid,
                    ownerUUID: newComment.ownerUUID,
                    content: newComment.content,
                    createdAt: newComment.createdAt,
                    selectedMode: newComment.selectedMode,
                }
            });
        });

        socket.on('commentsCreated', ({ journalEntry, newComments }) => {
            dispatchCreatedJournalBooks({
                type: 'CREATE_COMMENT_BATCH',
                payload: {
                    journalBookUUID: journalEntry.journalBookUUID,
                    journalEntryUUID: journalEntry.uuid,
                    comments: newComments,
                }
            });
        });

        // Listen for comment updates
        socket.on('commentUpdated', ({ journalEntry, comment }) => {

            dispatchCreatedJournalBooks({
                type: 'EDIT_COMMENT',
                payload:
                {
                    journalBookUUID: journalEntry.journalBookUUID,
                    journalEntryUUID: journalEntry.uuid,
                    commentThreadUUID: comment.commentThreadUUID,
                    commentUUID: comment.uuid,
                    newContent: comment.content,
                }
            });
        });

        // Listen for comment deletion
        socket.on('commentDeleted', ({ journalEntry, comment }) => {
            dispatchCreatedJournalBooks({
                type: 'DELETE_COMMENT',
                payload: {
                    journalBookUUID: journalEntry.journalBookUUID,
                    journalEntryUUID: journalEntry.uuid,
                    commentThreadUUID: comment.commentThreadUUID,
                    commentUUID: comment.uuid,
                }
            });
        });


        return () => {
            socket.off('characterCreated');
            socket.off('characterUpdated');
            socket.off('characterDeleted');
            socket.off('charactersReordered');
            socket.off('journalBookCreated');
            socket.off('journalEntryUpdated');
            socket.off('journalEntryDeleted');
            socket.off('commentCreated');
            socket.off('commentsCreated');
            socket.off('commentUpdated');
            socket.off('commentDeleted');
            socket.off('journalEntriesDeleted');
        };
    }, [dispatchCreatedCharacters, dispatchCreatedJournalBooks]);
};

export default useSocketListeners;


