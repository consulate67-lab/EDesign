import type { DesignState } from './types.ts';

/**
 * Merges the user's visual design elements AND style overrides into the original XSLT template code.
 */
export const mergeDesignWithXslt = (originalXslt: string, state: DesignState): string => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(originalXslt, 'text/xml');

    const styleToCss = (style?: React.CSSProperties): string => {
      if (!style) return '';
      // Convert camelCase to kebab-case
      return Object.entries(style)
        .map(([k, v]) => `${k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${v}`)
        .join(';');
    };



    // 1. Apply Overrides (Style + Content)
    state.xsltOverrides.forEach(override => {
      const el = doc.querySelector(`[data-design-id="${override.elementId}"]`);
      if (el) {
        // Apply Styles
        // We append to existing style attribute or create new one
        // Ideally we should merge, but appending !important works for overrides usually.
        // However, inline styles in XSLT might be tricky.
        // Let's just append our new styles.
        const newStyle = styleToCss(override.styleOverrides);
        const currentStyle = el.getAttribute('style') || '';

        // To ensure we override, we might need !important if not using ID selectors in CSS block.
        // But modifying the inline style is strongest.
        // The previous approach used a <style> block with !important.
        // Let's stick to inline style modification for simplicity in the DOM if we want per-element control.
        // Actually, inline style is better for position updates.
        el.setAttribute('style', currentStyle + ';' + newStyle);

        // Apply Content if overridden and not dynamic
        if (override.content !== undefined && !override.isDynamic) {
          // If it's an image, we might want to update src instead of text
          if (override.elementType === 'image' || el.tagName.toLowerCase() === 'img') {
            // For image, content is typically base64 or url
            el.setAttribute('src', override.content);
          } else {
            el.textContent = override.content;
          }
        }
      }
    });

    const serializer = new XMLSerializer();
    let result = serializer.serializeToString(doc);

    // Inject Theme Styles if provided
    if (state.themeColor) {
      const themeStyle = `
        <style>
            :root { --theme-color: ${state.themeColor}; }
            h1, h2, h3, h4, strong.title { color: ${state.themeColor} !important; }
            th { color: ${state.themeColor} !important; border-color: ${state.themeColor} !important; background-color: ${state.themeColor}15 !important; }
            table, td { border-color: ${state.themeColor}40 !important; }
            .theme-border { border-color: ${state.themeColor} !important; }
            .theme-text { color: ${state.themeColor} !important; }
        </style>
        `;

      const headEnd = result.indexOf('</head>');
      if (headEnd > -1) {
        result = result.slice(0, headEnd) + themeStyle + result.slice(headEnd);
      } else {
        // Try body
        const bodyStart = result.indexOf('<body');
        if (bodyStart > -1) {
          const bodyClose = result.indexOf('>', bodyStart) + 1;
          result = result.slice(0, bodyClose) + themeStyle + result.slice(bodyClose);
        }
      }
    }

    // 2. Inject User Added Elements (using existing logic but appending to body)
    // We can just construct the HTML string for new elements and inject before </body>
    // Re-using the logic from before for new elements construction

    // ... (logic for elementsXsl generation same as before) ...
    // Detect XSLT Prefix
    const xsltNs = 'http://www.w3.org/1999/XSL/Transform';
    let xslPrefix = 'xsl';
    // Helper to find prefix
    if (doc.documentElement) {
      // logic to finding prefix
      const attrs = doc.documentElement.attributes;
      for (let i = 0; i < attrs.length; i++) {
        if (attrs[i].value === xsltNs && attrs[i].name.startsWith('xmlns:')) {
          xslPrefix = attrs[i].name.substring(6);
          break;
        }
      }
    }

    const styleToCssForNew = (style?: React.CSSProperties, isInner: boolean = false): string => {
      if (!style) return '';
      const filteredStyle = isInner ? { ...style } : { ...style };
      if (isInner) {
        delete (filteredStyle as any).position;
        delete (filteredStyle as any).left;
        delete (filteredStyle as any).top;
        delete (filteredStyle as any).right;
        delete (filteredStyle as any).bottom;
      }
      return Object.entries(filteredStyle)
        .map(([k, v]) => `${k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${v}`)
        .join(';');
    };

    // Inject Turkish decimal format helper if not present
    // Uses the detected prefix
    const decimalFormatTag = `<${xslPrefix}:decimal-format name="tr" decimal-separator="," grouping-separator="." />`;
    if (result.indexOf(`:decimal-format name="tr"`) === -1) {
      // Find where to insert using the detected prefix in regex or generic
      // We look for :template, :output, etc. with any prefix potentially, but best to use our detected one if consistent
      const regex = new RegExp(`<(${xslPrefix}|xsl|xslt):template|:output|:variable|:param`);
      const match = result.match(regex);
      if (match && match.index !== undefined) {
        result = result.slice(0, match.index) + decimalFormatTag + '\n' + result.slice(match.index);
      } else {
        // Fallback: insert after root element start
        const rootEnd = result.indexOf('>');
        if (rootEnd > -1) {
          result = result.slice(0, rootEnd + 1) + '\n' + decimalFormatTag + '\n' + result.slice(rootEnd + 1);
        }
      }
    }

    const elementsXsl = state.elements.map(el => {
      let content = '';
      const elStyle = styleToCssForNew({
        ...el.style,
        position: 'absolute',
        left: `${el.x}px`,
        top: `${el.y}px`,
        zIndex: 1000
      });


      if (el.type === 'text') {
        let inner = el.content;
        if (el.binding) {
          if (el.format && (el.format === 'number' || el.format === 'currency' || el.format === 'percentage')) {
            const dec = el.decimals !== undefined ? el.decimals : 2;
            const zeros = '0'.repeat(dec);
            const pattern = `#.##0,${zeros}`;

            let valExpr = `format-number(${el.binding}, '${pattern}', 'tr')`;

            if (el.format === 'currency') {
              inner = `₺ ${`<${xslPrefix}:value-of select="${valExpr}"/>`}`;
            } else if (el.format === 'percentage') {
              inner = `%${`<${xslPrefix}:value-of select="${valExpr}"/>`}`;
            } else {
              inner = `<${xslPrefix}:value-of select="${valExpr}"/>`;
            }
          } else {
            inner = `<${xslPrefix}:value-of select="${el.binding}"/>`;
          }
        }
        content = `<span style="display:inline-block; word-break:break-word; width:100%; ${styleToCssForNew(el.style, true)}">${inner}</span>`;
      } else if (el.type === 'formula') {
        content = `<strong style="${styleToCssForNew(el.style, true)}"><${xslPrefix}:value-of select="${el.content}"/></strong>`;
      } else if (el.type === 'image') {
        content = `<img src="${el.content}" style="width:100%; height:100%; object-fit:contain; ${styleToCssForNew(el.style, true)}" />`;
      } else if (el.type === 'shape') {
        let shapeStyle = '';
        if (el.shapeType === 'circle') shapeStyle = 'border-radius:50%;';
        if (el.shapeType === 'line') shapeStyle = 'height:2px; border:none; background-color:black;';

        content = `<div style="width:100%; height:100%; border:1px solid #000; box-sizing:border-box; ${shapeStyle} ${styleToCssForNew(el.style, true)}"></div>`;
      } else if (el.type === 'qrcode') {
        content = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&amp;data=${el.content || 'QR-CODE'}" style="width:100%; height:100%; object-fit:contain; ${styleToCssForNew(el.style, true)}" />`;
      } else if (el.type === 'table' && el.tableData) {
        // ... table generation logic ...
        const totalWidth = el.colWidths?.reduce((a, b) => a + b, 0) || 300;
        content = `
                <table style="border-collapse:collapse; table-layout: fixed; border:1px solid #000; width:${totalWidth}px; ${styleToCssForNew(el.style, true)}">
                <tbody>
                    ${el.tableData.map((row, ri) => `
                    <tr style="${(el.rowHeights && el.rowHeights[ri]) ? `height:${el.rowHeights[ri]}px;` : ''}">
                        ${row.map((cell, ci) => {
          const cellInner = cell.binding ? `<xsl:value-of select="${cell.binding}"/>` : cell.content;
          const colWidth = el.colWidths && el.colWidths[ci] ? `${el.colWidths[ci]}px` : 'auto';
          const combinedStyle = { ...el.style, ...cell.style };
          return `<td style="border:1px solid #000; padding:4px; overflow:hidden; word-break:break-all; width:${colWidth}; ${styleToCssForNew(combinedStyle, true)}">${cellInner}</td>`;
        }).join('')}
                    </tr>
                    `).join('')}
                </tbody>
                </table>
            `;
      }

      return `<div style="${elStyle}">${content}</div>`;
    }).join('');

    const injectionPoint = result.lastIndexOf('</body>');
    if (injectionPoint !== -1) {
      return result.slice(0, injectionPoint) +
        `\n<!-- Designer Elements Start -->\n<div id="designer-elements">\n${elementsXsl}\n</div>\n<!-- Designer Elements End -->\n` +
        result.slice(injectionPoint);
    }

    return result;

  } catch (e) {
    console.error('Merge failed:', e);
    return originalXslt;
  }
};
