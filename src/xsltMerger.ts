import React from 'react';
import type { DesignState } from './types.ts';
import { normalizeXPath } from './designer/utils/xpathNormalize.ts';
import { styleToCss } from './designer/utils/cssSerializer.ts';

/**
 * Merges the user's visual design elements AND style overrides into the original XSLT template code.
 */
export const mergeDesignWithXslt = (originalXslt: string, state: DesignState): string => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(originalXslt, 'text/xml');

    // Check for parse errors in the base XSLT
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      console.error('Base XSLT Parse Error in Merger:', parseError.textContent);
      return originalXslt;
    }

    // 1. Apply Overrides (Style + Content)
    state.xsltOverrides.forEach(override => {
      const el = doc.querySelector(`[data-design-id="${override.elementId}"]`);
      if (el) {
        const newStyle = styleToCss(override.styleOverrides);
        const currentStyle = el.getAttribute('style') || '';
        const separator = currentStyle && !currentStyle.trim().endsWith(';') ? ';' : '';
        el.setAttribute('style', currentStyle + separator + newStyle);

        if (override.content !== undefined && !override.isDynamic) {
          if (override.elementType === 'qrcode') {
            el.setAttribute('src', `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(override.content || 'QR-CODE')}`);
          } else if (override.elementType === 'image' || el.tagName.toLowerCase() === 'img') {
            el.setAttribute('src', override.content);
          } else {
            el.textContent = override.content;
          }
        }
      }
    });

    const xsltNs = 'http://www.w3.org/1999/XSL/Transform';
    let xslPrefix = 'xsl';

    if (doc.documentElement) {
      const attrs = doc.documentElement.attributes;
      for (let i = 0; i < attrs.length; i++) {
        if (attrs[i].value === xsltNs) {
          if (attrs[i].name.startsWith('xmlns:')) {
            xslPrefix = attrs[i].name.substring(6);
          } else if (attrs[i].name === 'xmlns') {
            xslPrefix = '';
          }
        }
      }
    }

    const p = xslPrefix ? `${xslPrefix}:` : '';

    // Inject Turkish decimal format helper
    const existingDecimalFormats = doc.getElementsByTagNameNS(xsltNs, 'decimal-format');
    let hasTrFormat = false;
    for (let i = 0; i < existingDecimalFormats.length; i++) {
      if (existingDecimalFormats[i].getAttribute('name') === 'tr') {
        hasTrFormat = true;
        break;
      }
    }

    if (!hasTrFormat && doc.documentElement) {
      const decimalFormat = doc.createElementNS(xsltNs, `${p}decimal-format`);
      decimalFormat.setAttribute('name', 'tr');
      decimalFormat.setAttribute('decimal-separator', ',');
      decimalFormat.setAttribute('grouping-separator', '.');
      // Find where to insert: before first template or just at start
      const firstTemplate = doc.documentElement.getElementsByTagNameNS(xsltNs, 'template')[0];
      if (firstTemplate) {
        doc.documentElement.insertBefore(decimalFormat, firstTemplate);
      } else if (doc.documentElement.firstChild) {
        doc.documentElement.insertBefore(decimalFormat, doc.documentElement.firstChild);
      } else {
        doc.documentElement.appendChild(decimalFormat);
      }
    }

    // 2. Build Injected Elements and append directly to DOM
    if (state.elements.length > 0) {
      // Find suitable injection target in the order: body -> main template -> first template
      let target: Element | null = doc.querySelector('body');
      if (!target) {
        const templates = Array.from(doc.getElementsByTagNameNS(xsltNs, 'template'));
        const mainTemplate = templates.find(t => t.getAttribute('match') === '/') || templates[0];
        target = mainTemplate;
      }

      if (target) {
        // Create a comment to mark start
        target.appendChild(doc.createComment(' Designer Elements Start '));

        state.elements.forEach(el => {
          const wrapperStyle: React.CSSProperties = {
            ...el.style,
            position: 'absolute' as const,
            left: `${el.x}px`,
            top: `${el.y}px`,
            zIndex: 1000,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent'
          };

          const wrapper = doc.createElement('div');
          wrapper.setAttribute('style', styleToCss(wrapperStyle));

          if (el.type === 'text') {
            const span = doc.createElement('span');
            span.setAttribute('style', `display:inline-block; word-break:break-word; width:100%; ${styleToCss(el.style, { stripPositional: true })}`);

            if (el.binding) {
              const bindingPath = normalizeXPath(el.binding);

              if (el.format && ['number', 'currency', 'percentage'].includes(el.format)) {
                const dec = el.decimals !== undefined ? el.decimals : 2;
                const pattern = `#.##0,${'0'.repeat(dec)}`;
                const valExpr = `format-number(${bindingPath}, '${pattern}', 'tr')`;

                if (el.format === 'currency') {
                  span.appendChild(doc.createTextNode('₺ '));
                  const valOf = doc.createElementNS(xsltNs, `${p}value-of`);
                  valOf.setAttribute('select', valExpr);
                  span.appendChild(valOf);
                } else if (el.format === 'percentage') {
                  span.appendChild(doc.createTextNode('%'));
                  const valOf = doc.createElementNS(xsltNs, `${p}value-of`);
                  valOf.setAttribute('select', valExpr);
                  span.appendChild(valOf);
                } else {
                  const valOf = doc.createElementNS(xsltNs, `${p}value-of`);
                  valOf.setAttribute('select', valExpr);
                  span.appendChild(valOf);
                }
              } else {
                const valOf = doc.createElementNS(xsltNs, `${p}value-of`);
                valOf.setAttribute('select', bindingPath);
                span.appendChild(valOf);
              }
            } else {
              span.textContent = el.content;
            }
            wrapper.appendChild(span);
          } else if (el.type === 'formula') {
            const strong = doc.createElement('strong');
            strong.setAttribute('style', styleToCss(el.style, { stripPositional: true }));
            const valOf = doc.createElementNS(xsltNs, `${p}value-of`);
            valOf.setAttribute('select', el.content);
            strong.appendChild(valOf);
            wrapper.appendChild(strong);
          } else if (el.type === 'image') {
            const img = doc.createElement('img');
            img.setAttribute('src', el.content || '');
            img.setAttribute('style', `width:100%; height:100%; object-fit:contain; ${styleToCss(el.style, { stripPositional: true })}`);
            wrapper.appendChild(img);
          } else if (el.type === 'shape') {
            const div = doc.createElement('div');
            let shapeStyle = '';
            if (el.shapeType === 'circle') shapeStyle = 'border-radius:50%;';
            if (el.shapeType === 'line') shapeStyle = 'height:2px; border:none; background-color:black;';
            div.setAttribute('style', `width:100%; height:100%; border:1px solid #000; box-sizing:border-box; ${shapeStyle} ${styleToCss(el.style, { stripPositional: true })}`);
            wrapper.appendChild(div);
          } else if (el.type === 'qrcode') {
            const img = doc.createElement('img');
            img.setAttribute('src', `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(el.content || 'QR-CODE')}`);
            img.setAttribute('style', `width:100%; height:100%; object-fit:contain; ${styleToCss(el.style, { stripPositional: true })}`);
            wrapper.appendChild(img);
          } else if (el.type === 'table' && el.tableData) {
            const totalWidth = el.colWidths?.reduce((a, b) => a + b, 0) || 300;
            const table = doc.createElement('table');
            table.setAttribute('style', `border-collapse:collapse; table-layout: fixed; border:1px solid #000; width:${totalWidth}px; ${styleToCss(el.style, { stripPositional: true })}`);
            const tbody = doc.createElement('tbody');

            el.tableData.forEach((row, ri) => {
              const tr = doc.createElement('tr');
              if (el.rowHeights && el.rowHeights[ri]) {
                tr.setAttribute('style', `height:${el.rowHeights[ri]}px;`);
              }
              row.forEach((cell, ci) => {
                const td = doc.createElement('td');
                const colWidth = el.colWidths && el.colWidths[ci] ? `${el.colWidths[ci]}px` : 'auto';
                const combinedStyle = { ...el.style, ...cell.style };
                td.setAttribute('style', `border:1px solid #000; padding:4px; overflow:hidden; word-break:break-all; width:${colWidth}; ${styleToCss(combinedStyle, { stripPositional: true })}`);

                if (cell.binding) {
                  const valOf = doc.createElementNS(xsltNs, `${p}value-of`);
                  valOf.setAttribute('select', cell.binding);
                  td.appendChild(valOf);
                } else {
                  td.textContent = cell.content;
                }
                tr.appendChild(td);
              });
              tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            wrapper.appendChild(table);
          }
          target!.appendChild(wrapper);
        });

        target.appendChild(doc.createComment(' Designer Elements End '));
      }
    }

    // Inject Theme Styles directly into DOM
    if (state.themeColor) {
      const themeStyle = doc.createElement('style');
      themeStyle.textContent = `
            :root { --theme-color: ${state.themeColor}; }
            h1, h2, h3, h4, strong.title { color: ${state.themeColor} !important; }
            th { color: ${state.themeColor} !important; border-color: ${state.themeColor} !important; background-color: ${state.themeColor}15 !important; }
            table, td { border-color: ${state.themeColor}40 !important; }
            .theme-border { border-color: ${state.themeColor} !important; }
            .theme-text { color: ${state.themeColor} !important; }
      `;
      const head = doc.querySelector('head');
      if (head) {
        head.appendChild(themeStyle);
      } else if (doc.documentElement) {
        doc.documentElement.appendChild(themeStyle);
      }
    }

    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  } catch (e) {
    console.error('Merge failed:', e);
    return originalXslt;
  }
};
