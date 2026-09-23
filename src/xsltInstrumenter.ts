export const instrumentXslt = (xsltString: string): string => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xsltString, 'text/xml');

    // Check for parse errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      console.error('XSLT Parse Error during instrumentation:', parseError.textContent);
      throw new Error(`XSLT ayrıştırılamadı: ${parseError.textContent}`);
    }

    let idCounter = 0;
    const generateId = (prefix: string) => `${prefix}-${idCounter++}-${Math.random().toString(36).substring(2, 7)}`;

    const targetTags = ['table', 'img', 'div', 'p', 'td', 'th', 'tr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'b', 'strong', 'i', 'em', 'u', 'label', 'section', 'article', 'header', 'footer'];

    const processNode = (node: Element) => {
      // Process children first
      Array.from(node.children).forEach(child => processNode(child));

      const ns = node.namespaceURI;
      const tagName = node.localName?.toLowerCase() || '';

      // Only instrument literal result elements (likely HTML tags)
      const isXsl = ns === 'http://www.w3.org/1999/XSL/Transform';

      if (!isXsl && targetTags.includes(tagName)) {
        // Add ID
        const id = generateId(tagName);
        node.setAttribute('data-design-id', id);
        node.setAttribute('data-tag', tagName.toUpperCase());

        // Find associated XPath (data field)
        const directValueOf = Array.from(node.childNodes).find(child =>
          child.nodeType === 1 && (child as Element).localName === 'value-of' && (child as Element).namespaceURI === 'http://www.w3.org/1999/XSL/Transform'
        ) as Element | undefined;

        if (directValueOf) {
          const path = directValueOf.getAttribute('select');
          if (path) {
            node.setAttribute('data-xpath', path);
            node.setAttribute('data-is-dynamic', 'true');
          }
        } else {
          // Check following sibling for xsl:value-of
          let next = node.nextElementSibling;
          if (next && next.localName === 'value-of' && next.namespaceURI === 'http://www.w3.org/1999/XSL/Transform') {
            const path = next.getAttribute('select');
            if (path) {
              node.setAttribute('data-xpath', path);
              node.setAttribute('data-is-dynamic', 'true');
            }
          }
        }
      }
    };

    if (doc.documentElement) {
      processNode(doc.documentElement);
    }

    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  } catch (e) {
    console.error('Instrumentation failed:', e);
    throw e;
  }
};

export const selectionScript = `
    (function() {
        if (window.self === window.top) return;

        const getXPath = (element) => {
            if (element.getAttribute('data-xpath')) return element.getAttribute('data-xpath');
            if (element === document.body) return '/html/body';

            let ix = 0;
            const siblings = (element.parentNode ? element.parentNode.childNodes : []);
            for (let i = 0; i < siblings.length; i++) {
                const sibling = siblings[i];
                if (sibling === element)
                    return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
                if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
                    ix++;
            }
            return '';
        };

        const getStyles = (el) => {
            const computed = window.getComputedStyle(el);
            return {
                color: computed.color,
                backgroundColor: computed.backgroundColor,
                fontSize: computed.fontSize,
                fontWeight: computed.fontWeight,
                textAlign: computed.textAlign,
                padding: computed.padding,
                margin: computed.margin,
                border: computed.border,
                width: computed.width,
                height: computed.height,
                display: computed.display,
                fontFamily: computed.fontFamily,
                position: computed.position,
                left: computed.left,
                top: computed.top
            };
        };

        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-design-id]');
            if (!target) {
                window.parent.postMessage({ type: 'CANVAS_CLICKED' }, '*');
                return;
            }

            e.stopPropagation();

            const rect = target.getBoundingClientRect();
            const styles = getStyles(target);
            
            // Calculate CSS Left/Top as numbers
            const parsePx = (val) => {
                if (!val || val === 'auto') return 0;
                return parseFloat(val) || 0;
            };
            const relativeX = parsePx(styles.left);
            const relativeY = parsePx(styles.top);

            const elementId = target.getAttribute('data-design-id');
            const htmlTag = target.tagName.toLowerCase();
            let elementType = (target.getAttribute('data-tag') || htmlTag).toLowerCase();
            const src = target.getAttribute('src');
            
            // Detect if this is a QR code / Barcode
            if (htmlTag === 'img' && src && (src.includes('qr-code') || src.includes('barcode'))) {
                elementType = 'qrcode';
            }

            const path = target.getAttribute('data-xpath');
            const isDynamic = target.getAttribute('data-is-dynamic') === 'true';

            document.querySelectorAll('.designer-selected').forEach(el => {
                el.classList.remove('designer-selected');
                el.style.outline = '';
                el.style.boxShadow = '';
            });

            target.classList.add('designer-selected');
            target.style.outline = '2px solid #3b82f6';
            target.style.outlineOffset = '-2px';
            target.style.outline = '2px solid #3b82f6';
            target.style.outlineOffset = '-2px';

            const hierarchy = [];
            let curr = target;
            while(curr && curr !== document.body) {
                if (curr.getAttribute('data-design-id')) {
                    hierarchy.push({
                        id: curr.getAttribute('data-design-id'),
                        tag: curr.tagName.toLowerCase()
                    });
                }
                curr = curr.parentElement;
            }

            let tableData = null;
            let rowCount = 0;
            let colCount = 0;
            if (target.tagName === 'TABLE') {
                tableData = [];
                const rows = Array.from(target.querySelectorAll('tr'));
                rowCount = rows.length;
                rows.forEach(row => {
                    const cells = Array.from(row.querySelectorAll('td, th'));
                    colCount = Math.max(colCount, cells.length);
                    tableData.push(cells.map(c => ({
                        content: c.innerText,
                        id: c.getAttribute('data-design-id')
                    })));
                });
            }

            window.parent.postMessage({
                type: 'XSLT_ELEMENT_CLICKED',
                elementId,
                elementType,
                htmlTag: target.tagName.toLowerCase(),
                xpath: path,
                isDynamic,
                path: getXPath(target),
                currentStyles: styles,
                rect: {
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    x: rect.left + window.scrollX,
                    y: rect.top + window.scrollY,
                    width: rect.width,
                    height: rect.height
                },
                innerText: target.innerText,
                tableData,
                rowCount,
                colCount,
                relativeX,
                relativeY,
                src: target.tagName === 'IMG' ? target.src : null,
                hierarchy
            }, '*');
        });

        window.addEventListener('message', (event) => {
            if (event.data?.type === 'SELECT_ELEMENT') {
                const target = document.querySelector('[data-design-id="' + event.data.elementId + '"]');
                if (target) {
                    document.querySelectorAll('.designer-selected').forEach(el => {
                        el.classList.remove('designer-selected');
                        el.style.outline = '';
                        el.style.boxShadow = '';
                    });
                    target.classList.add('designer-selected');
                    target.style.outline = '2px solid #3b82f6';
                    target.style.outlineOffset = '-2px';
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else if (event.data?.type === 'UPDATE_ELEMENT_STYLE') {
                const target = document.querySelector('[data-design-id="' + event.data.elementId + '"]');
                if (target && event.data.style) {
                    Object.assign(target.style, event.data.style);
                }
            }
        });

        const designerStyles = document.createElement('style');
        designerStyles.textContent = '[data-design-id] { cursor: pointer; } [data-design-id]:hover { outline: 1px dashed #3b82f6; } .designer-selected { outline: 2px solid #3b82f6 !important; }';
        document.head.appendChild(designerStyles);
    })();
`;
