import * as XLSX from 'xlsx';

export interface SheetData {
  Material?: string;
  Date?: string;
  Customer?: string;
  'Order Ref'?: string;
  'Sheet Used (Y/N)'?: string;
  'Piece Size (mm)'?: string;
  Qty?: number;
  'Area per Piece (m²)'?: number;
  'Total Area Used (m²)'?: number;
  'Unit Cost'?: number;
  'Unit Sale Price'?: number;
  'Total Cost'?: number;
  'Total Sale'?: number;
  Profit?: number;
  'Leftover Area (m²)'?: number;
  'Offcut Used? (Y/N)'?: string;
  Notes?: string;
}

/**
 * Read Excel file from public folder
 * This is a placeholder that reads from the client-side
 * In a real application, you might want to use an API route for server-side processing
 */
export const readExcelFile = async (filename: string): Promise<SheetData[]> => {
  try {
    const response = await fetch(`/${filename}`);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json<SheetData>(worksheet);
    return data;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return [];
  }
};

/**
 * Write data to Excel file
 * This creates a downloadable Excel file
 */
export const writeExcelFile = (data: SheetData[], filename: string): void => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet Cutting Data');
    
    // Write file
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Error writing Excel file:', error);
  }
};

/**
 * Calculate total area used from sheet data
 */
export const calculateTotalArea = (data: SheetData[]): number => {
  return data.reduce((total, row) => {
    return total + (row['Total Area Used (m²)'] || 0);
  }, 0);
};

/**
 * Calculate total profit from sheet data
 */
export const calculateTotalProfit = (data: SheetData[]): number => {
  return data.reduce((total, row) => {
    return total + (row.Profit || 0);
  }, 0);
};

/**
 * Get stock summary by material
 */
export const getStockByMaterial = (data: SheetData[]): Record<string, number> => {
  const summary: Record<string, number> = {};
  
  data.forEach((row) => {
    const material = row.Material || 'Unknown';
    if (!summary[material]) {
      summary[material] = 0;
    }
    summary[material] += row['Total Area Used (m²)'] || 0;
  });
  
  return summary;
};
