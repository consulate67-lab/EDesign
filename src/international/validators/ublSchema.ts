/**
 * Minimal UBL field-presence validator. SCAFFOLD only.
 *
 * Real Peppol/EN 16931 validation requires:
 *   1. XSD schema validation (offline bundled XSDs)
 *   2. Schematron rules (per-country business rules)
 *   3. Code list validation (country codes, currency codes, units, etc.)
 *
 * This module provides the seed: an in-memory check that the fields marked
 * `mandatory: true` in the catalog are non-empty in the parsed XML.
 */

import { fieldsForDocType } from '../fieldCatalog';
import { findDocType } from '../registry/docTypes';

export interface ValidationIssue {
    fieldKey: string;
    severity: 'error' | 'warning';
    message: string;
}

const getNodeText = (xml: Document, xpath: string): string | null => {
    // Walk the normalized XPath (already local-name only) via DOM.
    const segs = xpath
        .replace(/^\/+/, '')
        .split('/')
        .filter((s) => s.length > 0);
    let node: Element | null = xml.documentElement;
    for (const seg of segs) {
        if (!node) return null;
        const localName = seg.includes(':') ? seg.split(':').pop()! : seg;
        const found: Element | undefined = Array.from(node.children).find(
            (c: Element) => c.localName === localName || c.tagName.endsWith(`:${localName}`)
        );
        node = found ?? null;
    }
    return node?.textContent?.trim() ?? null;
};

export const validateMandatoryFields = (xml: Document, docTypeId: string): ValidationIssue[] => {
    const def = findDocType(docTypeId);
    if (!def) {
        return [
            {
                fieldKey: '_root',
                severity: 'error',
                message: `Unknown doc type: ${docTypeId}`,
            },
        ];
    }
    // Check the root element matches the doc type definition.
    const rootLocal = xml.documentElement.localName;
    if (rootLocal !== def.rootElement) {
        return [
            {
                fieldKey: '_root',
                severity: 'error',
                message: `Expected root <${def.rootElement}>, got <${rootLocal}>`,
            },
        ];
    }

    const issues: ValidationIssue[] = [];
    for (const field of fieldsForDocType(docTypeId)) {
        if (!field.mandatory) continue;
        const value = getNodeText(xml, field.xpath);
        if (!value) {
            issues.push({
                fieldKey: field.key,
                severity: 'error',
                message: `Mandatory field missing: ${field.labelKey}`,
            });
        }
    }
    return issues;
};
