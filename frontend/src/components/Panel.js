// Panel Component (Draggable)

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

const Panel = (props) => {
    const { id, style, content } = props
    const { attributes, listeners, setNodeRef, transform } = useSortable({ id });
    const panelWidth = 700
    const panelStyle = {
        ...style,
        //translate (move) the panel as the user drags it
        transform: CSS.Transform.toString(transform),
        display: 'flex',
        flexDirection: 'column',

        borderRadius: '25px',
        padding: '20px',
        width: `${panelWidth}px`,
        minHeight: '1100px',
        marginBottom: '10px',
        boxShadow: '-3px 10px 10px hsl(0, 0%, 78%)',

    };
    const headerStyle = {
        backgroundColor: 'gray',
        padding: '10px',
        cursor: 'grab',
        justifyContent: 'top',
        display: 'block'
    };

    return (
        <div ref={setNodeRef} style={panelStyle}>
            {/* Only this header is draggable */}
            < div {...listeners} {...attributes} style={headerStyle} >
                Drag me!
            </div >
            {/* Rest of the panel content is non-draggable */}
            < div style={{ padding: '10px' }}>
                {content}
            </div >
        </div >
    );
}
export default Panel