import React, { useState, useEffect, useReducer, useRef } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import CharacterCreationPanel from './panel/Character/CharacterCreationPanel.js';
import CharacterProfilePanel from './panel/Character/CharacterProfilePanel.js';
import SidebarRight from './SideBarRight.js';
import SidebarLeft from './SideBarLeft.js';
import JournalPanel from './panel/Journal/JournalPanel.js';
import journalBookReducer from './panel/Journal/journalBookReducer.js';
import characterReducer from './panel/Character/characterReducer.js';
import { useTranslation } from 'react-i18next'; // i18n 가져오기
import '../i18n.js'; // i18n 설정 파일 가져오기

const Home = (props) => {
  const { loggedIn, userName, initialData } = props;
  const { i18n } = useTranslation(); // useTranslation 추가
  const [panels, setPanels] = useState([]);
  const [isDragging, setIsDragging] = useState(false); // Track drag state
  const panelsEndRef = useRef(null);
  const prevPanelsLengthRef = useRef(panels.length);
  const initialState = {
    journalBooks: initialData.journalBooks || [],
    lastCreatedJournalBook: null,
    participantIndex: {},
  };

  const [createdCharacters, dispatchCreatedCharacters] = useReducer(characterReducer, { characters: initialData.characters });
  const [createdJournalBooks, dispatchCreatedJournalBooks] = useReducer(journalBookReducer, initialState);
  const navigate = useNavigate();

  // 언어 변경 함수
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const onButtonClick = () => {
    if (loggedIn) {
      localStorage.removeItem('user');
      props.setLoggedIn(false);
    }
    navigate('/');
  };

  const scrollToNewPanel = () => {
    if (panelsEndRef.current) {
      panelsEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'end'
      });
    }
  };

  useEffect(() => {
    dispatchCreatedCharacters({
      type: 'INITIALIZE_CHARACTERS',
      payload: {
        characters: initialData.characters,
      },
    });
    dispatchCreatedJournalBooks({
      type: 'INITIALIZE_JOURNALBOOKS',
      payload: {
        journalBooks: initialData.journalBooks,
      },
    });
  }, [initialData]);

  useEffect(() => {
    if (panels.length > prevPanelsLengthRef.current) {
      scrollToNewPanel();
    }
    prevPanelsLengthRef.current = panels.length;

  }, [panels.length]);

  const handleDragStart = () => {
    setIsDragging(true); // Set dragging to true
  };

  const handleDragEnd = ({ active, over }) => {
    setIsDragging(false); // Reset dragging state
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
        <span className="logoText">⩉ Knots</span>
      </div>

      {/* Integrating Sidebar Right */}
      <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SidebarRight
          panels={panels}
          setPanels={setPanels}
          createdCharacters={createdCharacters}
          dispatchCreatedCharacters={dispatchCreatedCharacters}
        />
      </DndContext>

      {/* Integrating Sidebar Left */}
      <SidebarLeft panels={panels} setPanels={setPanels} />

      <div className="thread-wrapper">
        <div className="thread-container">
          <h1>KNOTS: A SOCIAL MEDIA FOR YOUR STORY CHARACTERS</h1>
          <span></span>
        </div>
      </div>

      <div className="panelContainer">
        <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={panels.map(panel => panel.id)}>
            <div ref={panelsEndRef} style={{ display: 'flex', gap: '20px', paddingRight: '170px', paddingLeft: '120px', }} >
              <AnimatePresence>
                {panels.map(panel => (
                  <motion.div
                    key={panel.id}
                    layout={!isDragging} // Disable layout animations when dragging
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderPanel(panel)}
                  </motion.div>
                ))}
              </AnimatePresence>
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
      
      <div className="language-switcher-container">      
        <div className="language-switcher">
          <button
            className={i18n.resolvedLanguage === 'en' ? 'selected' : ''}
            onClick={() => changeLanguage('en')}
          >
            EN
          </button>
          <button
            className={i18n.resolvedLanguage === 'ko' ? 'selected' : ''}
            onClick={() => changeLanguage('ko')}
          >
            KR
          </button>
        </div>
      </div>
    </div>
    
  );
}

export default Home;
