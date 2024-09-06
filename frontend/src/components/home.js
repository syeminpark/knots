

import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import Panel from './Panel.js';

// Container to hold panels
const Home = (props) => {
  const [panels, setPanels] = useState([
    { id: 'panel-1', content: 'Panel 1' },
    { id: 'panel-2', content: 'Panel 2' },
    { id: 'panel-3', content: 'Panel 3' },

  ]);
  const { loggedIn, userName } = props

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
        <text className="logoText">
          Knots
        </text>
      </div>
      <div class="sidebarRight">
        <h2 class="sidebarRight-title">Characters</h2>
        <div class="character-list">
          <button class="character-item">
            <div class="character-icon"></div>
            <span class="character-name">Harry</span>
          </button>
        </div>
        <div class="button-container">
          <button class="create-button">
            <i class="icon">+</i> Create
          </button>

        </div>
      </div>
      <button class="sidebarLeft">
        <i class="sidebarLeft-title">Journal</i>
      </button>
      <div className="panelContainer">
        <div><DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={panels.map(panel => panel.id)}>
            <div style={{ display: 'flex', gap: '20px' }}>
              {panels.map(panel => (
                <Panel key={panel.id} id={panel.id} content={panel.content} />
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