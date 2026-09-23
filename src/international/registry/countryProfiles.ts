/**
 * Country profile registry — Peppol/EN 16931 country rules.
 *
 * This is a SCAFFOLD only — the actual validation logic will live in
 * `validators/` and consume these rules. The schema is designed to be
 * extended without breaking the existing Turkish-only flow.
 *
 * References:
 *  - Peppol BIS Billing 3.0: https://docs.peppol.eu/poacc/billing/3.0/
 *  - EN 16931-1:2017 (European semantic electronic invoice standard)
 */

export type CountryCode = string; // ISO 3166-1 alpha-2, e.g. 'TR', 'DE'

export interface CountryProfile {
    code: CountryCode;
    name: string;
    /** Peppol AP/SMP identifier prefix (e.g. '0088' for many EU member states) */
    peppolIdPrefix?: string;
    /** Default currency (ISO 4217) */
    currency: string;
    /** Locale tag for formatting (numbers, dates) */
    locale: string;
    /** Whether this country mandates B2G electronic invoicing */
    mandatesB2G: boolean;
    /** Whether B2B electronic invoicing is mandated (most EU by 2025–2030) */
    mandatesB2B: boolean;
    /** Reference to local authority (e.g. 'GİB' for Türkiye) */
    authority?: string;
    /** Year B2G e-invoice became mandatory (informational) */
    b2gMandateYear?: number;
}

/** Profiles populated for the most common target markets. Add as needed. */
export const countryProfiles: CountryProfile[] = [
    {
        code: 'TR',
        name: 'Türkiye',
        currency: 'TRY',
        locale: 'tr-TR',
        mandatesB2G: true,
        mandatesB2B: false,
        authority: 'GİB',
        b2gMandateYear: 2014,
    },
    {
        code: 'DE',
        name: 'Deutschland',
        peppolIdPrefix: '9930',
        currency: 'EUR',
        locale: 'de-DE',
        mandatesB2G: true,
        mandatesB2B: true,
        authority: 'KoSIT',
        b2gMandateYear: 2018,
    },
    {
        code: 'FR',
        name: 'France',
        peppolIdPrefix: '0002',
        currency: 'EUR',
        locale: 'fr-FR',
        mandatesB2G: true,
        mandatesB2B: true,
        authority: 'AIFE',
        b2gMandateYear: 2017,
    },
    {
        code: 'IT',
        name: 'Italia',
        peppolIdPrefix: '0205',
        currency: 'EUR',
        locale: 'it-IT',
        mandatesB2G: true,
        mandatesB2B: true,
        authority: 'SdI',
        b2gMandateYear: 2019,
    },
    {
        code: 'NL',
        name: 'Nederland',
        peppolIdPrefix: '0106',
        currency: 'EUR',
        locale: 'nl-NL',
        mandatesB2G: true,
        mandatesB2B: false,
        authority: 'Logius',
    },
    {
        code: 'GB',
        name: 'United Kingdom',
        currency: 'GBP',
        locale: 'en-GB',
        mandatesB2G: true,
        mandatesB2B: false,
        authority: 'HMRC',
    },
    {
        code: 'SG',
        name: 'Singapore',
        peppolIdPrefix: '0195',
        currency: 'SGD',
        locale: 'en-SG',
        mandatesB2G: true,
        mandatesB2B: false,
        authority: 'IMDA',
    },
    {
        code: 'AU',
        name: 'Australia',
        peppolIdPrefix: '0151',
        currency: 'AUD',
        locale: 'en-AU',
        mandatesB2G: false,
        mandatesB2B: false,
        authority: 'ATO',
    },
];

export const findCountry = (code: CountryCode): CountryProfile | undefined =>
    countryProfiles.find((c) => c.code === code);

export const peppolCountries = (): CountryProfile[] =>
    countryProfiles.filter((c) => !!c.peppolIdPrefix);
