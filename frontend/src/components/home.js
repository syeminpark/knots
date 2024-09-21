import React, { useState, useEffect, useReducer } from 'react';
import { DndContext, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import CharacterCreationPanel from './panel/Character/CharacterCreationPanel.js';
import CharacterProfilePanel from './panel/Character/CharacterProfilePanel.js';
import SidebarRight from './SideBarRight.js';
import SidebarLeft from './SideBarLeft.js';
import JournalPanel from './panel/Journal/JournalPanel.js';
import journalBookReducer from './panel/Journal/journalBookReducer.js';
import characterReducer from './panel/Character/characterReducer.js';

const Home = (props) => {
  const initialState = {
    journalBooks: [],
    lastCreatedJournalBook: null,
    participantIndex: {},
  };

  const [panels, setPanels] = useState([])
  const { loggedIn, userName, initialData } = props
  const [createdCharacters, dispatchCreatedCharacters] = useReducer(characterReducer, { characters: initialData.characters })
  const [createdJournalBooks, dispatchCreatedJournalBooks] = useReducer(journalBookReducer, initialState)

  const navigate = useNavigate()

  const onButtonClick = () => {
    if (loggedIn) {
      localStorage.removeItem('user')
      props.setLoggedIn(false)
    }
    navigate('/')
  }

  useEffect(() => {
    dispatchCreatedCharacters({
      type: 'INITIALIZE_CHARACTERS',
      payload: {
        characters: initialData.characters,
      },
    });

  }, [initialData])



  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      const oldIndex = panels.findIndex(panel => panel.id === active.id);
      const newIndex = panels.findIndex(panel => panel.id === over.id);
      setPanels(arrayMove(panels, oldIndex, newIndex));
    }
  };

  const renderPanel = (panel) => {
    switch (panel.type) {
      case 'character-creation':
        return (
          <CharacterCreationPanel
            key={panel.id}
            id={panel.id}
            panels={panels}
            setPanels={setPanels}
            createdCharacters={createdCharacters}
            dispatchCreatedCharacters={dispatchCreatedCharacters}
          />
        );
      case 'character-profile':
        return (
          <CharacterProfilePanel
            key={panel.id}
            id={panel.id}
            panels={panels}
            setPanels={setPanels}
            caller={panel.caller}
            createdCharacters={createdCharacters}
            dispatchCreatedCharacters={dispatchCreatedCharacters}
            createdJournalBooks={createdJournalBooks}
            dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
          />
        );
      case 'journal':
        return (
          <JournalPanel
            key={panel.id}
            id={panel.id}
            panels={panels}
            setPanels={setPanels}
            reference={panel.reference}
            createdCharacters={createdCharacters}
            dispatchCreatedCharacters={dispatchCreatedCharacters}
            createdJournalBooks={createdJournalBooks}
            dispatchCreatedJournalBooks={dispatchCreatedJournalBooks}
          />
        );
      default:
        return null; // Handle unknown panel types
    }
  };

  return (
    <div className="homeContainer">
      <div className="logoContainer">
        <span className="logoText">
          ⩉ Knots
        </span>
      </div>

      {/* Integrating Sidebar Right */}
      <SidebarRight panels={panels}
        setPanels={setPanels}
        createdCharacters={createdCharacters}
      ></SidebarRight>

      {/* Integrating Sidebar Left */}
      <SidebarLeft panels={panels} setPanels={setPanels}></SidebarLeft>

      <div className="thread-wrapper">
        <div className="thread-container">
          <div className="thread-left"></div>
          <div className="thread-right"></div>
          <h1>Connect To Create, Create To Connect</h1>
        </div>
      </div>

      <div className="panelContainer">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={panels.map(panel => panel.id)}>
            <div style={{ display: 'flex', gap: '20px', }}>
              {panels.map(panel => (renderPanel((panel))))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="HomeButtonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={onButtonClick}
          value={loggedIn ? 'Log out' : 'Log in'}
        />
      </div>
    </div >
  );
}

export default Home;
