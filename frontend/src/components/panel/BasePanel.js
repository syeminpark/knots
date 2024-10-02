import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const BasePanel = (props) => {
    const { t } = useTranslation();
    const { id, panels, setPanels, children, title, saveFunction, deleteFunction } = props;
    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });


    const [showDelete, setShowDelete] = useState(false);

    const toggleDeleteButton = () => {
        setShowDelete(prev => !prev);
    };

    // const getPanelClass = () => {
    //     let panelClass = '';
    //     if (panels.length === 1) {
    //         panelClass = 'panel-large';
    //     } else if (panels.length === 2) {
    //         panelClass = 'panel-medium';
    //     } else {
    //         panelClass = 'panel-small';
    //     }
    //     return panelClass
    // }

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
        // <div ref={setNodeRef} className={`panel ${getPanelClass()}`} style={panelStyle}>
        <div ref={setNodeRef} className='panel' style={panelStyle}>
            {/* Panel Header */}
            < div className="panel-header" {...listeners} {...attributes}>
                <h2 className="header-title">{title}</h2>
            </div >
            <div className="x-more-button-container">
                {deleteFunction && (
                    <button className="more-btn" onClick={toggleDeleteButton}>...</button>
                )}
                {showDelete && deleteFunction && (
                    <button className="delete-btn" onClick={deleteFunction}>{t('delete')}</button>
                )}
                <button className="close-btn" onClick={onCloseButtonClick}>✖</button>
            </div>

            {/* Panel Content */}
            <div className="panel-content">
                {children}
            </div>
        </div >
    );
};

export default BasePanel;
