import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { DesignElement } from './types.ts';

interface Props {
    element: DesignElement;
    isSelected: boolean;
    onClick: () => void;
    children?: React.ReactNode;
}

export const DraggableElement: React.FC<Props> = ({ element, isSelected, onClick, children }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: element.id,
    });

    // Helper to filter out styles that shouldn't be on the wrapper
    const getWrapperStyle = (el: DesignElement): React.CSSProperties => {
        const { position, left, top, right, bottom, color, fontSize, fontWeight, fontStyle, backgroundColor, ...rest } = (el.style || {}) as any;
        return rest; // Only keep things like width, height, etc. for the wrapper
    };

    const style: React.CSSProperties = {
        position: 'absolute',
        left: element.x,
        top: element.y,
        transform: CSS.Translate.toString(transform),
        outline: isSelected ? '2px solid #6366f1' : '1px dashed #cbd5e1',
        outlineOffset: '-1px',
        zIndex: isSelected ? 1000 : 100,
        padding: '0px',
        minWidth: '10px',
        minHeight: '10px',
        cursor: 'move',
        pointerEvents: 'auto',
        background: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
        ...getWrapperStyle(element), // Apply width/height to the wrapper
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {children}
        </div>
    );
};
