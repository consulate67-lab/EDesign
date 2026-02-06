import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { DesignElement } from './types.ts';

interface Props {
    element: DesignElement;
    isSelected: boolean;
    onClick: (e: React.MouseEvent) => void;
    onResize?: (id: string, newWidth: number, newHeight: number, newX?: number, newY?: number) => void;
    onResizeStart?: () => void;
    onResizeEnd?: () => void;
    children?: React.ReactNode;
    scale?: number;
}

export const DraggableElement: React.FC<Props> = ({ element, isSelected, onClick, onResize, onResizeStart, onResizeEnd, children, scale = 1 }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: element.id,
    });

    // Helper to filter out styles that shouldn't be on the wrapper
    const getWrapperStyle = (el: DesignElement): React.CSSProperties => {
        const { position, left, top, right, bottom, color, fontSize, fontWeight, fontStyle, backgroundColor, width, height, ...rest } = (el.style || {}) as any;
        return rest; // Only keep things like width, height, etc. for the wrapper
    };

    const finalTransform = transform ? {
        ...transform,
        x: transform.x / scale,
        y: transform.y / scale
    } : null;

    // Dimensions
    const width = parseInt(element.style?.width as string) || 100;
    const height = parseInt(element.style?.height as string) || 50;

    const style: React.CSSProperties = {
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: `${width}px`,
        height: `${height}px`,
        transform: CSS.Translate.toString(finalTransform),
        outline: isSelected ? '2px solid #6366f1' : '1px dashed #cbd5e1',
        outlineOffset: '-1px',
        zIndex: isSelected ? 1000 : 100,
        padding: '0px',
        cursor: 'move',
        pointerEvents: 'auto',
        background: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
        ...getWrapperStyle(element),
    };

    // Resize Handler
    const handleResizeStart = (e: React.PointerEvent, direction: string) => {
        e.stopPropagation();
        e.preventDefault();

        if (onResizeStart) onResizeStart();


        const startXMouse = e.clientX;
        const startYMouse = e.clientY;
        const startWidth = width;
        const startHeight = height;
        const startXPos = element.x; // Current X position
        const startYPos = element.y; // Current Y position

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const deltaX = (moveEvent.clientX - startXMouse) / scale;
            const deltaY = (moveEvent.clientY - startYMouse) / scale;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newX = startXPos;
            let newY = startYPos;

            // Horizontal resizing
            if (direction.includes('e')) {
                newWidth = startWidth + deltaX;
            } else if (direction.includes('w')) {
                newWidth = startWidth - deltaX;
                newX = startXPos + deltaX;
            }

            // Vertical resizing
            if (direction.includes('s')) {
                newHeight = startHeight + deltaY;
            } else if (direction.includes('n')) {
                newHeight = startHeight - deltaY;
                newY = startYPos + deltaY;
            }

            // Constrain minimum size
            if (newWidth < 20) {
                newWidth = 20;
                if (direction.includes('w')) {
                    newX = startXPos + (startWidth - 20);
                }
            }
            if (newHeight < 20) {
                newHeight = 20;
                if (direction.includes('n')) {
                    newY = startYPos + (startHeight - 20);
                }
            }

            if (onResize) {
                onResize(element.id, Math.round(newWidth), Math.round(newHeight), Math.round(newX), Math.round(newY));
            }
        };

        const handlePointerUp = () => {
            if (onResizeEnd) onResizeEnd();
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    const handleStyle: React.CSSProperties = {
        position: 'absolute',
        width: '12px',
        height: '12px',
        background: 'white',
        border: '2px solid #6366f1',
        borderRadius: '50%',
        zIndex: 1001,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={(e) => {
                e.stopPropagation();
                onClick(e);
            }}
        >
            {children}

            {/* Resize handles removed as per user request */}
        </div>
    );
};
