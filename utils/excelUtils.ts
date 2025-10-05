import * as XLSX from 'xlsx';

// Customer interface
export interface Customer {
  'Customer Name'?: string;
  'Contact'?: string;
  'Phone'?: string;
  'Email'?: string;
  'Address'?: string;
  'Company'?: string;
  'Notes'?: string;
}

// Factory/Supplier interface
export interface Factory {
  'Factory Name'?: string;
  'Contact Person'?: string;
  'Phone'?: string;
  'Email'?: string;
  'Address'?: string;
  'Supplied Materials'?: string;
  'Notes'?: string;
}

// Purchase/Stock Purchase interface
export interface Purchase {
  'Purchase Date'?: string;
  'Factory Name'?: string;
  'Material'?: string;
  'Size (mm)'?: string;
  'Quantity'?: number;
  'Unit Cost'?: number;
  'Total Cost'?: number;
  'Batch/Ref'?: string;
  'Notes'?: string;
}

// Enhanced SheetData with traceability
export interface SheetData {
  'Material'?: string;
  'Date'?: string;
  'Customer'?: string;
  'Order Ref'?: string;
  'Sheet Used (Y/N)'?: string;
  'Piece Size (mm)'?: string;
  'Qty'?: number;
  'Area per Piece (m²)'?: number;
  'Total Area Used (m²)'?: number;
  'Unit Cost'?: number;
  'Unit Sale Price'?: number;
  'Total Cost'?: number;
  'Total Sale'?: number;
  'Profit'?: number;
  'Leftover Area (m²)'?: number;
  'Offcut Used? (Y/N)'?: string;
  'Notes'?: string;
  // New fields for traceability
  'Batch/Ref'?: string;
  'Factory Name'?: string;
}

/**
 * Read Excel file from public folder
 */
export const readExcelFile = async (filename: string): Promise<SheetData[]> => {
  try {
    const response = await fetch(`/${filename}`);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Get the first sheet (or Orders sheet if it exists)
    const sheetName = workbook.SheetNames.includes('Orders') ? 'Orders' : workbook.SheetNames[0];
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
 * Read Customers from Excel file
 */
export const readCustomers = async (filename: string): Promise<Customer[]> => {
  try {
    const response = await fetch(`/${filename}`);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    if (workbook.SheetNames.includes('Customers')) {
      const worksheet = workbook.Sheets['Customers'];
      const data = XLSX.utils.sheet_to_json<Customer>(worksheet);
      return data;
    }
    return [];
  } catch (error) {
    console.error('Error reading customers:', error);
    return [];
  }
};

/**
 * Read Factories from Excel file
 */
export const readFactories = async (filename: string): Promise<Factory[]> => {
  try {
    const response = await fetch(`/${filename}`);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    if (workbook.SheetNames.includes('Factories')) {
      const worksheet = workbook.Sheets['Factories'];
      const data = XLSX.utils.sheet_to_json<Factory>(worksheet);
      return data;
    }
    return [];
  } catch (error) {
    console.error('Error reading factories:', error);
    return [];
  }
};

/**
 * Read Purchases from Excel file
 */
export const readPurchases = async (filename: string): Promise<Purchase[]> => {
  try {
    const response = await fetch(`/${filename}`);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    if (workbook.SheetNames.includes('Purchases')) {
      const worksheet = workbook.Sheets['Purchases'];
      const data = XLSX.utils.sheet_to_json<Purchase>(worksheet);
      return data;
    }
    return [];
  } catch (error) {
    console.error('Error reading purchases:', error);
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
  const stockByMaterial: Record<string, number> = {};
  
  data.forEach((row) => {
    const material = row.Material || 'Unknown';
    const area = row['Total Area Used (m²)'] || 0;
    
    if (stockByMaterial[material]) {
      stockByMaterial[material] += area;
    } else {
      stockByMaterial[material] = area;
    }
  });
  
  return stockByMaterial;
};

/**
 * Get orders by customer
 */
export const getOrdersByCustomer = (data: SheetData[], customerName: string): SheetData[] => {
  return data.filter(order => order.Customer === customerName);
};

/**
 * Get purchases by factory
 */
export const getPurchasesByFactory = (purchases: Purchase[], factoryName: string): Purchase[] => {
  return purchases.filter(purchase => purchase['Factory Name'] === factoryName);
};

/**
 * Get unique customers from orders
 */
export const getUniqueCustomers = (data: SheetData[]): string[] => {
  const customers = new Set(data.map(row => row.Customer).filter(Boolean));
  return Array.from(customers) as string[];
};

/**
 * Get unique factories from purchases
 */
export const getUniqueFactories = (purchases: Purchase[]): string[] => {
  const factories = new Set(purchases.map(row => row['Factory Name']).filter(Boolean));
  return Array.from(factories) as string[];
};
