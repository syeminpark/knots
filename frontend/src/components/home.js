

import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import Panel from './panel/CharacterPanel.js';
import SidebarRight from './SideBarRight.js';
import SidebarLeft from './SideBarLeft.js';

// Container to hold panels
const Home = (props) => {
  const [panels, setPanels] = useState([])
  const { loggedIn, userName } = props
  const [createdCharacters, setCreatedCharacters] = useState(['Harry', 'Snape'])


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

  return (
    <div className="homeContainer">
      <div className="logoContainer">
        <span className="logoText">
          Knots
        </span>
      </div>
      <SidebarRight panels={panels} setPanels={setPanels} createdCharacters={createdCharacters}></SidebarRight>
      <SidebarLeft panels={panels} setPanels={setPanels}></SidebarLeft>
      <div className="thread-wrapper">
        <div className="thread-container">
          <div className="thread-left"></div>
          <div className="thread-right"></div>
          <h1>Connect To Create, Create To Connect</h1>
        </div>

      </div>
      <div className="panelContainer">
        <div><DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={panels.map(panel => panel.id)}>
            <div style={{ display: 'flex', gap: '20px' }}>
              {panels.map(panel => (

                <Panel key={panel.id} id={panel.id} type={panel.type} panels={panels} setPanels={setPanels} />
              ))}
            </div>

          </SortableContext>
        </DndContext>
        </div>
      </div>

      <div className={'HomeButtonContainer'}>
        <input
          className={'inputButton'}
          type="button"
          onClick={onButtonClick}
          value={loggedIn ? 'Log out' : 'Log in'}
        />

      </div>
    </div >

  );
}
export default Home