/**
 * Document Type Registry — single source of truth for supported e-document
 * types. Adding a new doc type is a data-only change; no code changes
 * required. The visual designer reads from this list to populate the
 * document picker, and validators pull rules per doc type.
 *
 * Namespace strategy: the designer's UBL paths are namespace-prefix agnostic
 * (see normalizeXPath in designer/utils/xpathNormalize.ts), so the same
 * field catalog works across `cac:`/`cbc:` (UBL 2.1 / Peppol) and other
 * profiles.
 */

export type DocTypeId =
    | 'invoice'
    | 'creditNote'
    | 'despatchAdvice'
    | 'order'
    | 'orderResponse';

export interface DocTypeDefinition {
    id: DocTypeId;
    /** UBL root element local name, e.g. 'Invoice' */
    rootElement: string;
    /** Default XSLT template filename in /public (falls back to defaultTemplate) */
    defaultTemplate: string;
    /** List of countries (ISO 3166-1 alpha-2) where this doc type is supported */
    supportedCountries: string[];
    /** Whether this doc type requires a digital signature (e.g. Turkish e-Fatura) */
    requiresSignature: boolean;
    /** Default category shown in the UI doc picker */
    category: 'turkish' | 'peppol' | 'custom';
}

export const docTypes: DocTypeDefinition[] = [
    {
        id: 'invoice',
        rootElement: 'Invoice',
        defaultTemplate: 'Modern_1.0_Fatura.xslt',
        supportedCountries: ['TR', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PL', 'SE', 'FI', 'DK', 'NO', 'IE', 'PT', 'GB', 'SG', 'AU', 'NZ', 'JP'],
        requiresSignature: true,
        category: 'peppol',
    },
    {
        id: 'creditNote',
        rootElement: 'CreditNote',
        defaultTemplate: 'Classic_Corporate.xslt',
        supportedCountries: ['TR', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'GB', 'SG', 'AU', 'NZ'],
        requiresSignature: true,
        category: 'peppol',
    },
    {
        id: 'despatchAdvice',
        rootElement: 'DespatchAdvice',
        defaultTemplate: 'irsaliye.xslt',
        supportedCountries: ['TR', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'GB', 'SG', 'AU'],
        requiresSignature: false,
        category: 'turkish',
    },
    {
        id: 'order',
        rootElement: 'Order',
        defaultTemplate: 'Blank_Design.xslt',
        supportedCountries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'GB', 'SG', 'AU', 'NZ'],
        requiresSignature: false,
        category: 'peppol',
    },
    {
        id: 'orderResponse',
        rootElement: 'OrderResponse',
        defaultTemplate: 'Blank_Design.xslt',
        supportedCountries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'GB', 'SG', 'AU'],
        requiresSignature: false,
        category: 'peppol',
    },
];

export const findDocType = (id: string): DocTypeDefinition | undefined =>
    docTypes.find((d) => d.id === id);

export const docTypesByCategory = (category: DocTypeDefinition['category']) =>
    docTypes.filter((d) => d.category === category);

export const isCountrySupported = (id: DocTypeId, country: string): boolean => {
    const def = findDocType(id);
    return def ? def.supportedCountries.includes(country) : false;
};
