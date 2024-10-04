import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import CharacterCreationPanel from './panel/Character/CharacterCreationPanel.js';
import CharacterProfilePanel from './panel/Character/CharacterProfilePanel.js';
import SidebarRight from './SideBarRight.js';
import SidebarLeft from './SideBarLeft.js';
import JournalPanel from './panel/Journal/JournalPanel.js';
import journalBookReducer from './panel/Journal/journalBookReducer.js';
import characterReducer from './panel/Character/characterReducer.js';
import ScrollAndDrag from './ScrollAndDrag.js';
import { useTranslation } from 'react-i18next'; // i18n 가져오기
import '../i18n.js'; // i18n 설정 파일 가져오기
import apiRequest from '../utility/apiRequest.js';

const Home = (props) => {
  const { t } = useTranslation();
  const { loggedIn, userName, initialData } = props;
  const { i18n } = useTranslation(); // useTranslation 추가
  const [panels, setPanels] = useState([]);
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


  useEffect(() => {
    // Initialize characters and journal books from the initial data when the component mounts
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
    const interval = setInterval(async () => {
      try {
        // Fetch latest data from the server
        const journalData = await apiRequest('/getAllJournalBooks', 'GET',);


        // Update local state with the latest data from the server
        dispatchCreatedJournalBooks({
          type: 'INITIALIZE_JOURNALBOOKS',
          payload: {
            journalBooks: journalData.journalBooks,
          },
        });
      } catch (error) {
        console.error('Error fetching latest journal books:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Fetch latest data from the server
        const characterData = await apiRequest('/getAllCharacters', 'GET',);

        // Update local state with the latest data from the server

        dispatchCreatedCharacters({
          type: 'INITIALIZE_CHARACTERS',
          payload: {
            characters: characterData
          },
        });
      } catch (error) {
        console.error('Error fetching latest journal books:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);




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
      <div className="logoContainer" >
        <span className="logoText">⩉ Knots</span>
      </div>

      {/* Integrating Sidebar Right */}
      <SidebarRight
        panels={panels}
        setPanels={setPanels}
        createdCharacters={createdCharacters}
        dispatchCreatedCharacters={dispatchCreatedCharacters}
      />

      {/* Integrating Sidebar Left */}
      <SidebarLeft panels={panels} setPanels={setPanels} />

      <div className="thread-wrapper">
        <div className="thread-container">
          <h1> {t('knots')}</h1>
          <span></span>
        </div>
      </div>

      {/* Use ScrollToNewPanel to handle drag & scroll functionalities */}
      <div className="panelContainer">
        <ScrollAndDrag panels={panels} setPanels={setPanels} renderPanel={renderPanel} />
      </div>

      <div className="HomeButtonContainer">
        <input
          className="inputButton"
          type="button"
          onClick={onButtonClick}
          value={loggedIn ? "Log out" : "Log in"} // t('logout') : t('login')
        />
      </div>
    </div>
  );
};

export default Home;