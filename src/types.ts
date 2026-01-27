export type ElementType = 'text' | 'table' | 'image' | 'formula' | 'shape' | 'qrcode';

export interface TableCell {
  content: string;
  binding?: string;
  style?: React.CSSProperties;
}

export interface DesignElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  content: string; // Used for text and formula
  binding?: string; // XML path mapping for text
  style?: React.CSSProperties;
  formula?: string; // For formula elements
  rows?: number;    // For table elements
  cols?: number;    // For table elements
  colWidths?: number[]; // For table elements
  rowHeights?: number[]; // For table elements
  tableData?: TableCell[][]; // For table elements
  shapeType?: 'rect' | 'circle' | 'line'; // For shape elements
  format?: string; // e.g., 'number', 'currency', 'percentage'
  decimals?: number; // Number of decimal places
}

export interface XsltElementOverride {
  elementId: string; // Unique ID for the XSLT element
  elementType: 'field' | 'image' | 'img' | 'table' | 'tr' | 'td' | 'th'; // Type of element
  path?: string; // XPath or src for the element
  x?: number; // X position relative to the workspace
  y?: number; // Y position relative to the workspace
  width?: number; // Captured width
  height?: number; // Captured height
  content?: string; // Overridden text content
  isDynamic?: boolean; // Is it a dynamic XSLT field?
  styleOverrides: React.CSSProperties; // Style changes to apply
  tableData?: TableCell[][]; // Extracted table structure
  rowCount?: number;
  colCount?: number;
  shapeType?: 'rect' | 'circle' | 'line'; // NEW: Recognition for shapes in XSLT
}

export interface DesignState {
  elements: DesignElement[];
  xsltOverrides: XsltElementOverride[]; // NEW: Store style overrides for existing XSLT elements
  companyName: string;
  logoUrl?: string;
  selectedId: string | null;
  selectedXsltElement: XsltElementOverride | null; // NEW: Currently selected XSLT element
}
