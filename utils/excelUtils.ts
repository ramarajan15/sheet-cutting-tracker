import * as XLSX from 'xlsx';

// Core data interfaces for traceability
// All dimensions are in millimeters (mm), and all costs/prices are in Indian Rupees (₹)
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface Factory {
  id: string;
  name: string;
  location?: string;
  contact?: string;
  email?: string;
  phone?: string;
  materials?: string[];
  notes?: string;
}

export interface Purchase {
  id: string;
  date: string;
  factoryId: string;
  factoryName?: string;
  material: string;
  size: string; // Dimensions in millimeters (e.g., "2440x1220")
  thickness?: string;
  qty: number;
  unitCost: number; // Cost in Indian Rupees (₹)
  totalCost: number; // Cost in Indian Rupees (₹)
  batchRef?: string;
  notes?: string;
}

export interface StockSheet {
  id: string;
  purchaseId: string;
  factoryId: string;
  material: string;
  size: string; // Dimensions in millimeters
  thickness?: string;
  dateReceived: string;
  batchRef?: string;
  status: 'available' | 'in-use' | 'used' | 'leftover';
  notes?: string;
}

export interface Order {
  id: string;
  orderRef: string;
  date: string;
  customerId: string;
  customerName?: string;
  sheetId?: string;
  material: string;
  pieceSize: string; // Dimensions in millimeters (e.g., "500x300")
  qty: number;
  areaPerPiece?: number; // Area in square meters (m²)
  totalAreaUsed?: number; // Area in square meters (m²)
  unitCost?: number; // Cost in Indian Rupees (₹)
  unitSalePrice?: number; // Price in Indian Rupees (₹)
  totalCost?: number; // Cost in Indian Rupees (₹)
  totalSale?: number; // Revenue in Indian Rupees (₹)
  profit?: number; // Profit in Indian Rupees (₹)
  notes?: string;
}

export interface Leftover {
  id: string;
  parentSheetId: string;
  purchaseId?: string;
  factoryId?: string;
  material: string;
  length: number; // Length in millimeters (mm)
  width: number; // Width in millimeters (mm)
  thickness?: string;
  area: number; // Area in square meters (m²)
  dateCreated: string;
  fromOrderRef?: string;
  status: 'available' | 'used';
  notes?: string;
}

// Legacy SheetData interface for backward compatibility
// All dimensions are in millimeters (mm), areas in m², and costs/prices in Indian Rupees (₹)
export interface SheetData {
  Material?: string;
  Date?: string;
  Customer?: string;
  'Order Ref'?: string;
  'Sheet Used (Y/N)'?: string;
  'Piece Size (mm)'?: string;  // Dimensions in millimeters (e.g., "500x300")
  Qty?: number;
  'Area per Piece (m²)'?: number;  // Area in square meters
  'Total Area Used (m²)'?: number;  // Area in square meters
  'Unit Cost'?: number;  // Cost in Indian Rupees (₹)
  'Unit Sale Price'?: number;  // Price in Indian Rupees (₹)
  'Total Cost'?: number;  // Cost in Indian Rupees (₹)
  'Total Sale'?: number;  // Revenue in Indian Rupees (₹)
  Profit?: number;  // Profit in Indian Rupees (₹)
  'Leftover Area (m²)'?: number;  // Area in square meters
  'Offcut Used? (Y/N)'?: string;
  Notes?: string;
  // Extended fields for traceability
  'Customer ID'?: string;
  'Sheet ID'?: string;
  'Purchase ID'?: string;
  'Factory ID'?: string;
  'Factory Name'?: string;
  'Batch Ref'?: string;
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
 * Read a specific sheet from Excel file
 */
export const readExcelSheet = async <T>(filename: string, sheetName: string): Promise<T[]> => {
  try {
    const response = await fetch(`/${filename}`);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    if (workbook.SheetNames.includes(sheetName)) {
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json<T>(worksheet);
      return data;
    }
    return [];
  } catch (error) {
    console.error(`Error reading sheet ${sheetName} from Excel file:`, error);
    return [];
  }
};

/**
 * Read customers from Excel file
 */
export const readCustomers = async (filename: string): Promise<Customer[]> => {
  return readExcelSheet<Customer>(filename, 'Customers');
};

/**
 * Read factories from Excel file
 */
export const readFactories = async (filename: string): Promise<Factory[]> => {
  return readExcelSheet<Factory>(filename, 'Factories');
};

/**
 * Read purchases from Excel file
 */
export const readPurchases = async (filename: string): Promise<Purchase[]> => {
  return readExcelSheet<Purchase>(filename, 'Purchases');
};

/**
 * Read stock sheets from Excel file
 */
export const readStockSheets = async (filename: string): Promise<StockSheet[]> => {
  return readExcelSheet<StockSheet>(filename, 'Stock');
};

/**
 * Map Excel row to Order interface
 * Converts Excel column names to Order interface field names
 */
const mapExcelRowToOrder = (row: any): Order => {
  return {
    id: row['Order Ref'] || row.id || '',
    orderRef: row['Order Ref'] || row.orderRef || '',
    date: row['Date'] || row.date || '',
    customerId: row['Customer ID'] || row.customerId || '',
    customerName: row['Customer'] || row.customerName,
    sheetId: row['Sheet ID'] || row.sheetId,
    material: row['Material'] || row.material || '',
    pieceSize: row['Piece Size (mm)'] || row.pieceSize || '',
    qty: row['Qty'] || row.qty || 0,
    areaPerPiece: row['Area per Piece (m²)'] || row.areaPerPiece,
    totalAreaUsed: row['Total Area Used (m²)'] || row.totalAreaUsed,
    unitCost: row['Unit Cost'] || row.unitCost,
    unitSalePrice: row['Unit Sale Price'] || row.unitSalePrice,
    totalCost: row['Total Cost'] || row.totalCost,
    totalSale: row['Total Sale'] || row.totalSale,
    profit: row['Profit'] || row.profit,
    notes: row['Notes'] || row.notes
  };
};

/**
 * Read orders from Excel file
 */
export const readOrders = async (filename: string): Promise<Order[]> => {
  const rawData = await readExcelSheet<any>(filename, 'Orders');
  return rawData.map(mapExcelRowToOrder);
};

/**
 * Read leftovers from Excel file
 */
export const readLeftovers = async (filename: string): Promise<Leftover[]> => {
  return readExcelSheet<Leftover>(filename, 'Leftovers');
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

/**
 * Get orders by customer
 */
export const getOrdersByCustomer = (orders: Order[]): Record<string, Order[]> => {
  const grouped: Record<string, Order[]> = {};
  
  orders.forEach((order) => {
    const customerId = order.customerId || 'Unknown';
    if (!grouped[customerId]) {
      grouped[customerId] = [];
    }
    grouped[customerId].push(order);
  });
  
  return grouped;
};

/**
 * Get purchases by factory
 */
export const getPurchasesByFactory = (purchases: Purchase[]): Record<string, Purchase[]> => {
  const grouped: Record<string, Purchase[]> = {};
  
  purchases.forEach((purchase) => {
    const factoryId = purchase.factoryId || 'Unknown';
    if (!grouped[factoryId]) {
      grouped[factoryId] = [];
    }
    grouped[factoryId].push(purchase);
  });
  
  return grouped;
};

/**
 * Calculate total spent with factories
 */
export const calculateTotalSpent = (purchases: Purchase[]): number => {
  return purchases.reduce((total, purchase) => total + (purchase.totalCost || 0), 0);
};

/**
 * Get materials by factory
 */
export const getMaterialsByFactory = (factories: Factory[]): Record<string, string[]> => {
  const materials: Record<string, string[]> = {};
  
  factories.forEach((factory) => {
    materials[factory.id] = factory.materials || [];
  });
  
  return materials;
};

/**
 * Export data to Excel file with multiple sheets
 */
export const exportToExcel = (
  filename: string,
  data: {
    customers?: Customer[];
    factories?: Factory[];
    purchases?: Purchase[];
    orders?: Order[];
    stock?: StockSheet[];
    leftovers?: Leftover[];
  }
): void => {
  try {
    const workbook = XLSX.utils.book_new();

    if (data.customers) {
      const customersSheet = XLSX.utils.json_to_sheet(data.customers);
      XLSX.utils.book_append_sheet(workbook, customersSheet, 'Customers');
    }

    if (data.factories) {
      const factoriesSheet = XLSX.utils.json_to_sheet(data.factories);
      XLSX.utils.book_append_sheet(workbook, factoriesSheet, 'Factories');
    }

    if (data.purchases) {
      const purchasesSheet = XLSX.utils.json_to_sheet(data.purchases);
      XLSX.utils.book_append_sheet(workbook, purchasesSheet, 'Purchases');
    }

    if (data.orders) {
      const ordersSheet = XLSX.utils.json_to_sheet(data.orders);
      XLSX.utils.book_append_sheet(workbook, ordersSheet, 'Orders');
    }

    if (data.stock) {
      const stockSheet = XLSX.utils.json_to_sheet(data.stock);
      XLSX.utils.book_append_sheet(workbook, stockSheet, 'Stock');
    }

    if (data.leftovers) {
      const leftoversSheet = XLSX.utils.json_to_sheet(data.leftovers);
      XLSX.utils.book_append_sheet(workbook, leftoversSheet, 'Leftovers');
    }

    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  }
};
