import React, { useState, useReducer } from 'react';
import { DndContext, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import CharacterCreationPanel from './panel/Character/CharacterCreationPanel.js';
import CharacterProfilePanel from './panel/Character/CharacterProfilePanel.js';
import SidebarRight from './SideBarRight.js';
import SidebarLeft from './SideBarLeft.js';
import JournalPanel from './panel/Journal/JournalPanel.js';
import journalBookReducer from './panel/Journal/journalBookReducer.js';

// Container to hold panels
const Home = (props) => {
  const [panels, setPanels] = useState([])
  const { loggedIn, userName } = props
  const [createdCharacters, setCreatedCharacters] = useState([])
  const [createdJournalBooks, dispatchCreatedJournalBooks] = useReducer(journalBookReducer, { journalBooks: [] })

  const navigate = useNavigate()

  const onButtonClick = () => {
    if (loggedIn) {
      localStorage.removeItem('user')
      props.setLoggedIn(false)
    }
    navigate('/')
  }

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
            setCreatedCharacters={setCreatedCharacters}
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
            setCreatedCharacters={setCreatedCharacters}
          />
        );
      case 'journal':
        return (
          <JournalPanel
            key={panel.id}
            id={panel.id}
            panels={panels}
            setPanels={setPanels}
            createdCharacters={createdCharacters}
            setCreatedCharacters={setCreatedCharacters}
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
          Knots
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
        <div>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={panels.map(panel => panel.id)}>
              {/* <div style={{ display: 'flex', gap: '20px', flexDirection: 'row-reverse' }}> */}
              <div style={{ display: 'flex', gap: '20px', }}>
                {panels.map(panel => (renderPanel((panel))))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <div className="HomeButtonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={onButtonClick}
          value={loggedIn ? 'Log out' : 'Log in'}
        />
      </div>
    </div>
  );
}

export default Home;
