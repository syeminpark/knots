// ScrollToNewPanel.js
import React, { useEffect, useRef, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';

const ScrollAndDrag = (props) => {
  const { panels, setPanels, renderPanel } = props
  const panelsEndRef = useRef(null);
  const prevPanelsLengthRef = useRef(panels.length);
  const [isDragging, setIsDragging] = useState(false); // Track drag state

  // Function to scroll to the newly added panel
  const scrollToNewPanel = () => {
    if (panelsEndRef.current) {
      panelsEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'end',
      });
    }
  };

  // Watch for changes in panel length and trigger the scroll
  useEffect(() => {
    if (panels.length > prevPanelsLengthRef.current) {
      scrollToNewPanel();
    }
    prevPanelsLengthRef.current = panels.length;
  }, [panels.length]);

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true); // Set dragging to true
  };

  // Handle drag end
  const handleDragEnd = ({ active, over }) => {
    setIsDragging(false); // Reset dragging state
    if (over && active.id !== over.id) {
      const oldIndex = panels.findIndex((panel) => panel.id === active.id);
      const newIndex = panels.findIndex((panel) => panel.id === over.id);
      setPanels(arrayMove(panels, oldIndex, newIndex));
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SortableContext items={panels.map((panel) => panel.id)}>
        <div
          style={{ display: 'flex', gap: '20px', paddingRight: '170px', paddingLeft: '120px' }}
        >
          <AnimatePresence>
            {panels.map((panel) => (
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
          {/* Scroll reference point */}
          <div ref={panelsEndRef}></div>
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ScrollAndDrag
