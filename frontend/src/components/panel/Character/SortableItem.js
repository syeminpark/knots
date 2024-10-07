// SortableItem.js
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Attribute from '../Attribute';

const SortableItem = (props) => {
    const { id, attribute, deleteFunction, list, setter, onChange } = props;
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Attribute
                key={attribute.name}
                title={attribute.name}
                deleteFunction={deleteFunction}
                list={list}
                setter={setter}
                onChange={onChange}
            />
        </div>
    );
};

export default SortableItem;
