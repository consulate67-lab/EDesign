/**
 * International public API — barrel re-export for the international
 * sub-system. Importers should use this entry point to keep imports
 * stable as internals are reorganized.
 */
export * from './registry/docTypes';
export * from './registry/countryProfiles';
export * from './fieldCatalog';
export * from './validators/ublSchema';
