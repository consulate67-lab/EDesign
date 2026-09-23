import type { CSSProperties } from 'react';

/**
 * Style props that should be hoisted onto a positioned wrapper element.
 * Inner elements (text/span/td) must not receive these — they would
 * override the absolute-positioning contract of the parent.
 */
export const POSITIONAL_KEYS = ['position', 'left', 'top', 'right', 'bottom'] as const;

/**
 * Removes positional style props (position/left/top/right/bottom) from a style
 * object. Returns a new object — does not mutate the input.
 */
export const stripPositionalStyles = (style?: CSSProperties): CSSProperties => {
    if (!style) return {};
    const { position, left, top, right, bottom, ...rest } = style as CSSProperties & Record<string, unknown>;
    void position; void left; void top; void right; void bottom;
    return rest;
};

const camelToKebab = (key: string): string =>
    key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/**
 * Serializes a React CSSProperties object into a CSS declaration string.
 *
 * - Drops null / undefined / empty-string values
 * - Converts camelCase keys to kebab-case
 * - Optionally marks certain positional keys with `!important` so they win
 *   against inline style cascades from the original XSLT template.
 */
export const styleToCss = (
    style?: CSSProperties,
    options: { importantKeys?: readonly string[]; stripPositional?: boolean } = {}
): string => {
    if (!style) return '';
    const { importantKeys = ['left', 'top', 'position'], stripPositional = false } = options;

    return Object.entries(style as Record<string, unknown>)
        .filter(([, v]) => v !== null && v !== undefined && v !== '')
        .filter(([k]) => !(stripPositional && (POSITIONAL_KEYS as readonly string[]).includes(k)))
        .map(([k, v]) => {
            const name = camelToKebab(k);
            const important = importantKeys.includes(name) ? ' !important' : '';
            return `${name}:${v}${important}`;
        })
        .join(';');
};
