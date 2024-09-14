import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

const BasePanel = (props) => {
    const { id, panels, setPanels, children, title, saveFunction, } = props;
    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });

    const panelStyle = {
        transform: CSS.Transform.toString(transform),
        boxShadow: isDragging ? '0px 0px 20px rgba(0, 0, 0, 0.1)' : '-5px 5px 5px rgba(0, 0, 0, 0.1)',
        opacity: isDragging ? 0.8 : 1,
    };

    const onCloseButtonClick = () => {
        const newPanels = panels.filter(panel => panel.id !== id);
        setPanels(newPanels);
    };

    return (
        <div ref={setNodeRef} className="panel" style={panelStyle}>
            {/* Panel Header */}
            <div className="panel-header" {...listeners} {...attributes}>
                <h2 className="header-title">{title}</h2>
            </div>
            <div className="x-more-button-container">
                <button className="more-btn">...</button>
                <button className="close-btn" onClick={onCloseButtonClick}>✖</button>
            </div>

            {/* Panel Content */}
            <div className="panel-content">
                {children}
            </div>
        </div>
    );
};

export default BasePanel;
