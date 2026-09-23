/**
 * Normalizes a UBL XPath expression for use in XSLT `<value-of select="...">`.
 *
 * The visual designer stores bindings as either:
 *   - Full XPaths (starting with `/` or `//`)
 *   - Relative element chains (e.g. `cac:Invoice/cbc:ID`)
 *
 * For runtime evaluation we convert relative chains into `*[local-name()='...']`
 * predicates so the same binding works regardless of the source XML's namespace
 * prefixes (UBL-TR uses `cac:`/`cbc:`, but other UBL profiles may differ).
 *
 * Examples:
 *   cac:Invoice/cbc:ID                  → *[local-name()='Invoice']/*[local-name()='ID']
 *   Invoice/AccountingSupplierParty     → *[local-name()='Invoice']/*[local-name()='AccountingSupplierParty']
 *   //cbc:ID                            → //cbc:ID  (returned as-is)
 */
export const normalizeXPath = (path: string): string => {
    if (!path) return '';
    if (path.startsWith('//') || path.startsWith('/')) return path;

    return path
        .split('/')
        .filter((seg) => seg.length > 0)
        .map((seg) => {
            const localName = seg.includes(':') ? seg.split(':')[1] : seg;
            return `*[local-name()='${localName}']`;
        })
        .join('/');
};
