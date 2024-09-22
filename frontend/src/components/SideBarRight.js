import { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CharacterButton from './CharacterButton';
import openNewPanel from './openNewPanel';
import apiRequest from '../utility/apiRequest';

const DraggableCharacterItem = ({ character, panels, setPanels }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: character.uuid,
    });

    const containerStyle = {
        transform: transform
            ? `translate3d(0, ${transform.y}px, 0)`
            : undefined,
        transition,
        cursor: 'grab',
        userSelect: 'none', // Prevents text selection during dragging
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '10px',
        padding: '5px',
        margin: '5px',
        backgroundColor: '#f0f0f0', // Optional: Add a background color

    };

    const draggableAreaStyle = {
        flex: 1,
        width: '10%',
        cursor: 'grab',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '5px',
        // boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',

    };

    const profileButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        borderWidth: '0px',
        borderRadius: '10px',
        background: 'none',
        padding: '5px',
        margin: '0',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
    };

    return (
        <div
            ref={setNodeRef}
            style={containerStyle}
            {...attributes}
            {...listeners}
        >
            {/* Draggable Area at the Top */}
            <div style={draggableAreaStyle}></div>

            {/* Profile and Name at the Bottom */}
            <button
                style={profileButtonStyle}
                onClick={() => {
                    openNewPanel(panels, setPanels, 'character-profile', character);
                }}
                onPointerDown={(event) => event.stopPropagation()}
            >
                <CharacterButton createdCharacter={character} />
            </button>
        </div>
    );
};


const SidebarRight = (props) => {
    const { panels, setPanels, createdCharacters, dispatchCreatedCharacters } = props;

    const handleDragEnd = async ({ active, over }) => {
        if (active.id !== over?.id) {
            const oldIndex = createdCharacters.characters.findIndex(
                (char) => char.uuid === active.id
            );
            const newIndex = createdCharacters.characters.findIndex(
                (char) => char.uuid === over?.id
            );

            const newCharacters = Array.from(createdCharacters.characters);
            const [movedItem] = newCharacters.splice(oldIndex, 1);
            newCharacters.splice(newIndex, 0, movedItem);

            dispatchCreatedCharacters({
                type: 'REORDER_CHARACTERS',
                payload: newCharacters,
            });

            try {
                const reorderedUUIDs = newCharacters.map((character) => character.uuid);
                const response = await apiRequest('/reorderCharacters', 'POST', { characters: reorderedUUIDs });
                console.log(response)
            } catch (error) {
                console.error('Failed to save character order:', error);
            }
        }
    };

    return (
        <div className="sidebarRight">
            <h3 className="sidebarRight-title">Characters</h3>

            <span className="sidebarRight-subtitle">
                Online - {createdCharacters.characters.length}
            </span>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={createdCharacters.characters.map((char) => char.uuid)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="character-list">
                        {createdCharacters.characters.length > 0 &&
                            createdCharacters.characters.map((character) => (
                                <DraggableCharacterItem
                                    key={character.uuid}
                                    character={character}
                                    panels={panels}
                                    setPanels={setPanels}
                                />
                            ))}
                    </div>
                </SortableContext>
            </DndContext>

            <div className="buttonContainer">
                <button
                    className="create-button"
                    onClick={() => {
                        openNewPanel(panels, setPanels, 'character-creation');
                    }}
                >
                    <span className="icon">+</span> Create
                </button>
            </div>
        </div>
    );
};



export default SidebarRight;
