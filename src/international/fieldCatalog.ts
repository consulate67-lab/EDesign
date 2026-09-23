/**
 * Field Catalog — i18n-aware UBL field definitions.
 *
 * This is a SCAFFOLD that complements (and is intended to gradually replace)
 * the current `standardFields.ts` table. Each field has:
 *  - A normalized XPath (used by the designer for `value-of select=`)
 *  - i18n label keys (resolved at render time via i18next)
 *  - Category for grouping in the field picker
 *  - Optional format hint (date, number, currency)
 *
 * Migrating the existing Turkish `standardFields.ts` is a follow-up: copy the
 * entries here, replace literal labels with t('fieldCatalog.xxx.yyy') keys.
 */

export type FieldCategory = 'document' | 'party' | 'line' | 'totals' | 'tax' | 'payment';

export type FieldFormat = 'text' | 'number' | 'currency' | 'date' | 'percentage' | 'boolean';

export interface FieldDefinition {
    /** Stable identifier used in i18n key (e.g. 'invoice.number') */
    key: string;
    /** Localized label resolved at render time */
    labelKey: string;
    /** Normalized XPath for value binding (see xpathNormalize.ts) */
    xpath: string;
    category: FieldCategory;
    format?: FieldFormat;
    /** Whether this field is mandatory for the chosen doc type */
    mandatory?: boolean;
    /** List of doc types this field belongs to */
    appliesTo: string[];
}

/** Initial seed entries — extend as needed. */
export const fieldCatalog: FieldDefinition[] = [
    {
        key: 'invoice.number',
        labelKey: 'fields.invoice.number',
        xpath: 'Invoice/ID',
        category: 'document',
        mandatory: true,
        appliesTo: ['invoice', 'creditNote'],
    },
    {
        key: 'invoice.issueDate',
        labelKey: 'fields.invoice.issueDate',
        xpath: 'Invoice/IssueDate',
        category: 'document',
        format: 'date',
        mandatory: true,
        appliesTo: ['invoice', 'creditNote'],
    },
    {
        key: 'invoice.documentCurrency',
        labelKey: 'fields.invoice.documentCurrency',
        xpath: 'Invoice/DocumentCurrencyCode',
        category: 'document',
        mandatory: true,
        appliesTo: ['invoice', 'creditNote'],
    },
    {
        key: 'party.supplier.name',
        labelKey: 'fields.party.supplier.name',
        xpath: 'Invoice/AccountingSupplierParty/Party/PartyName',
        category: 'party',
        mandatory: true,
        appliesTo: ['invoice', 'creditNote', 'order'],
    },
    {
        key: 'party.customer.name',
        labelKey: 'fields.party.customer.name',
        xpath: 'Invoice/AccountingCustomerParty/Party/PartyName',
        category: 'party',
        mandatory: true,
        appliesTo: ['invoice', 'creditNote', 'order'],
    },
    {
        key: 'totals.lineExtension',
        labelKey: 'fields.totals.lineExtension',
        xpath: 'Invoice/LegalMonetaryTotal/LineExtensionAmount',
        category: 'totals',
        format: 'currency',
        appliesTo: ['invoice', 'creditNote'],
    },
    {
        key: 'totals.taxExclusive',
        labelKey: 'fields.totals.taxExclusive',
        xpath: 'Invoice/LegalMonetaryTotal/TaxExclusiveAmount',
        category: 'totals',
        format: 'currency',
        appliesTo: ['invoice', 'creditNote'],
    },
    {
        key: 'totals.taxInclusive',
        labelKey: 'fields.totals.taxInclusive',
        xpath: 'Invoice/LegalMonetaryTotal/TaxInclusiveAmount',
        category: 'totals',
        format: 'currency',
        appliesTo: ['invoice', 'creditNote'],
    },
    {
        key: 'totals.payable',
        labelKey: 'fields.totals.payable',
        xpath: 'Invoice/LegalMonetaryTotal/PayableAmount',
        category: 'totals',
        format: 'currency',
        mandatory: true,
        appliesTo: ['invoice', 'creditNote'],
    },
];

export const findField = (key: string): FieldDefinition | undefined =>
    fieldCatalog.find((f) => f.key === key);

export const fieldsByCategory = (category: FieldCategory) =>
    fieldCatalog.filter((f) => f.category === category);

export const fieldsForDocType = (docTypeId: string) =>
    fieldCatalog.filter((f) => f.appliesTo.includes(docTypeId));
