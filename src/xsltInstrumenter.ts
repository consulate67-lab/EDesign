/**
 * Safely instruments the XSLT by adding unique IDs to structural elements
 * without changing the DOM hierarchy or wrapping elements.
 */
// 1. Inject Style & Script for interactivity
// This script runs inside the preview IFrame
export const selectionScript = `
    <style type="text/css">
      [data-design-id] {
        cursor: pointer !important;
        transition: outline 0.1s;
      }
      [data-design-id]:hover {
        outline: 2px dashed #6366f1 !important;
        background-color: rgba(99, 102, 241, 0.05);
      }
      [data-design-id].selected-element {
        outline: 3px solid #6366f1 !important;
        background-color: rgba(99, 102, 241, 0.1);
        z-index: 1000;
        position: relative;
      }
    </style>
    <script>
      window.addEventListener('click', (e) => {
        const target = e.target.closest('[data-design-id]');
        console.log('Clicked target:', target);
        if (target) {
            e.preventDefault();
            e.stopPropagation();

            // Clear previous selection
            document.querySelectorAll('.selected-element').forEach(el => el.classList.remove('selected-element'));
            target.classList.add('selected-element');

            // Send info to parent
            const computed = window.getComputedStyle(target);
            const family = computed.fontFamily;

            let tableData = null;
            let rowCount = 0;
            let colCount = 0;
            // Try to find underlying XSLT select path if dynamic
            let dynamicPath = target.getAttribute('data-xpath') || '';
            
            if (!dynamicPath) {
                const valueOf = target.querySelector('value-of, [select]');
                if (valueOf) {
                    dynamicPath = valueOf.getAttribute('select') || '';
                } else if (target.hasAttribute('data-is-dynamic')) {
                    dynamicPath = target.innerText.trim();
                }
            }

            const tableEl = target.tagName === 'TABLE' ? target : target.closest('table');
            if (tableEl && (target.tagName === 'TABLE' || target.closest('table') === tableEl)) {
                const rows = Array.from(tableEl.rows);
                rowCount = rows.length;
                colCount = rowCount > 0 ? rows[0].cells.length : 0;
                tableData = rows.map(row => 
                    Array.from(row.cells).map(cell => ({
                        content: cell.innerText.trim(),
                        style: {
                            fontSize: window.getComputedStyle(cell).fontSize,
                            fontWeight: window.getComputedStyle(cell).fontWeight,
                            textAlign: window.getComputedStyle(cell).textAlign
                        }
                    }))
                );
            }

            window.parent.postMessage({
                type: 'XSLT_ELEMENT_CLICKED',
                elementId: target.getAttribute('data-design-id'),
                elementType: target.tagName.toLowerCase(),
                path: dynamicPath || target.getAttribute('src') || target.innerText.substring(0, 20) + '...',
                innerText: target.innerText,
                tableData,
                rowCount,
                colCount,
                dynamicPath,
                currentStyles: {
                    fontSize: computed.fontSize,
                    color: computed.color,
                    backgroundColor: computed.backgroundColor,
                    fontWeight: computed.fontWeight,
                    fontStyle: computed.fontStyle,
                    width: computed.width,
                    height: computed.height,
                    fontFamily: family,
                    position: computed.position
                },
                rect: target.getBoundingClientRect(),
                isDynamic: target.hasAttribute('data-is-dynamic')
            }, '*');
        }
      }, true);

      window.addEventListener('message', (event) => {
        console.log('Iframe received message:', event.data);
        const { type, elementId } = event.data;
        const el = document.querySelector('[data-design-id="' + elementId + '"]');

        if (el) {
            if (type === 'UPDATE_ELEMENT_STYLE') {
                Object.assign(el.style, event.data.style);
                 // If position is being updated, ensure it is absolute
                if (event.data.style.left || event.data.style.top) {
                    el.style.position = 'absolute';
                }
            } else if (type === 'UPDATE_ELEMENT_CONTENT') {
                el.innerText = event.data.content;
            }
        }
      });
    </script>
    `;

export const instrumentXslt = (xsltString: string): string => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xsltString, 'text/xml');

    // Check for parse errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      console.error('XSLT Parse Error during instrumentation:', parseError.textContent);
      return xsltString; // Fallback to original
    }

    let idCounter = 0;
    const generateId = (prefix: string) => `${prefix}-${idCounter++}-${Math.random().toString(36).substr(2, 5)}`;
    const targetTags = ['table', 'img', 'div', 'p', 'span', 'td', 'th', 'tr', 'h1', 'h2', 'h3', 'strong', 'b', 'i'];

    const processNode = (node: Element) => {
      // Process children first
      Array.from(node.children).forEach(child => processNode(child));

      const tagName = node.tagName.toLowerCase();
      if (targetTags.includes(tagName)) {
        // Add ID
        const id = generateId(tagName);
        node.setAttribute('data-design-id', id);

        // Find associated XPath (data field)
        // 1. Check direct children first for xsl:value-of
        const directValueOf = Array.from(node.childNodes).find(child =>
          child.nodeType === 1 && (child as Element).localName === 'value-of'
        ) as Element | undefined;

        // 2. Or check descendants if it's a small container
        const descendantValueOf = node.querySelector('value-of');

        const path = directValueOf?.getAttribute('select') || descendantValueOf?.getAttribute('select');
        if (path) {
          node.setAttribute('data-xpath', path);
          node.setAttribute('data-is-dynamic', 'true');
        }

        // Check if dynamic (contains any xsl elements)
        const hasXsl = Array.from(node.childNodes).some(child =>
          child.nodeType === 1 && (child as Element).namespaceURI?.includes('w3.org/1999/XSL/Transform')
        ) || (node.querySelector('*') && Array.from(node.querySelectorAll('*')).some(el => el.namespaceURI?.includes('w3.org/1999/XSL/Transform')));

        if (hasXsl) {
          node.setAttribute('data-is-dynamic', 'true');
        }
      }
    };

    // Start processing from root
    processNode(doc.documentElement);

    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  } catch (e) {
    console.error('Instrumentation failed:', e);
    return xsltString;
  }
};
