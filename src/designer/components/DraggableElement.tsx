import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { DesignElement } from '../../types.ts';

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
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: element.id,
    });

    // Helper to filter out styles that shouldn't be on the wrapper
    const getWrapperStyle = (el: DesignElement): React.CSSProperties => {
        const { position, left, top, right, bottom, color, fontSize, fontWeight, fontStyle, backgroundColor, width, height, border, borderStyle, borderWidth, borderColor, boxShadow, ...rest } = (el.style || {}) as any;
        return rest;
    };

    // Compensate for CSS transform: scale(designZoom) on parent container.
    // dnd-kit delta is in screen pixels, but CSS scale shrinks translations visually.
    // Dividing by scale ensures element follows mouse 1:1.
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
        outline: isSelected ? '2px solid #6366f1' : 'none',
        outlineOffset: '-1px',
        zIndex: isDragging ? 2000 : (isSelected ? 1000 : 100),
        padding: '0px',
        cursor: 'default',
        pointerEvents: 'auto', // CRITICAL: Enable pointer events so drag works
        background: 'transparent',
        willChange: isDragging ? 'transform' : 'auto',
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
        const startXPos = element.x;
        const startYPos = element.y;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const deltaX = (moveEvent.clientX - startXMouse) / scale;
            const deltaY = (moveEvent.clientY - startYMouse) / scale;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newX = startXPos;
            let newY = startYPos;

            if (direction.includes('e')) {
                newWidth = startWidth + deltaX;
            } else if (direction.includes('w')) {
                newWidth = startWidth - deltaX;
                newX = startXPos + deltaX;
            }

            if (direction.includes('s')) {
                newHeight = startHeight + deltaY;
            } else if (direction.includes('n')) {
                newHeight = startHeight - deltaY;
                newY = startYPos + deltaY;
            }

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
        pointerEvents: 'auto',
        cursor: 'nwse-resize'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={(e) => {
                // Prevent drag click from propagating to canvas
                e.stopPropagation();
                if (onClick) onClick(e);
            }}
        >
            {/* Drag handle - visual indicator mostly, since whole element is draggable now */}
            {isSelected && (
                <div
                    style={{
                        position: 'absolute',
                        top: '-24px',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        cursor: 'move',
                        pointerEvents: 'auto',
                        zIndex: 999
                    }}
                >
                    {/* Tag label */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            height: '24px',
                            padding: '0 8px',
                            background: '#6366f1',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            borderRadius: '4px 4px 0 0',
                            whiteSpace: 'nowrap',
                            zIndex: 1002
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" /><polyline points="15 19 12 22 9 19" /><polyline points="19 9 22 12 19 15" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" /></svg>
                        TAŞI
                    </div>
                </div>
            )}

            {/* Content - simple opacity reduction during drag for performance */}
            <div style={{
                pointerEvents: 'none',
                opacity: isDragging ? 0.7 : 1,
                transition: 'none'
            }}>
                {children}
            </div>

            {/* Corner Resize Handle */}
            {isSelected && onResize && (
                <div
                    style={{ ...handleStyle, bottom: '-6px', right: '-6px', cursor: 'nwse-resize' }}
                    onPointerDown={(e) => handleResizeStart(e, 'se')}
                />
            )}
        </div>
    );
};
