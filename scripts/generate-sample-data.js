// Script to generate sample Excel data with multiple sheets for traceability
const XLSX = require('xlsx');
const path = require('path');

// Sample Customers
const customers = [
  {
    id: 'CUST001',
    name: 'ABC Manufacturing',
    email: 'contact@abcmfg.com',
    phone: '+1-555-0101',
    address: '123 Industrial Ave, New York, NY',
    notes: 'Regular customer, monthly orders'
  },
  {
    id: 'CUST002',
    name: 'XYZ Construction',
    email: 'info@xyzconstruction.com',
    phone: '+1-555-0102',
    address: '456 Builder St, Los Angeles, CA',
    notes: 'Large volume orders'
  },
  {
    id: 'CUST003',
    name: 'Tech Solutions Inc',
    email: 'procurement@techsolutions.com',
    phone: '+1-555-0103',
    address: '789 Tech Park, San Francisco, CA',
    notes: 'Specialty materials required'
  }
];

// Sample Factories
const factories = [
  {
    id: 'FAC001',
    name: 'Steel Works Ltd',
    location: 'Pittsburgh, PA',
    contact: 'John Smith',
    email: 'john@steelworks.com',
    phone: '+1-555-0201',
    materials: 'Stainless Steel, Mild Steel',
    notes: 'Primary steel supplier'
  },
  {
    id: 'FAC002',
    name: 'Aluminum Solutions',
    location: 'Detroit, MI',
    contact: 'Jane Doe',
    email: 'jane@alumsolutions.com',
    phone: '+1-555-0202',
    materials: 'Aluminum 6061, Aluminum 5052',
    notes: 'High quality aluminum'
  },
  {
    id: 'FAC003',
    name: 'Copper Industries',
    location: 'Phoenix, AZ',
    contact: 'Bob Johnson',
    email: 'bob@copperind.com',
    phone: '+1-555-0203',
    materials: 'Copper, Brass',
    notes: 'Specialized copper products'
  }
];

// Sample Purchases
const purchases = [
  {
    id: 'PUR001',
    date: '2024-01-15',
    factoryId: 'FAC001',
    factoryName: 'Steel Works Ltd',
    material: 'Stainless Steel',
    size: '2440x1220',
    thickness: '3mm',
    qty: 50,
    unitCost: 85.50,
    totalCost: 4275.00,
    batchRef: 'BATCH-2024-001',
    notes: 'Premium grade stainless steel'
  },
  {
    id: 'PUR002',
    date: '2024-01-20',
    factoryId: 'FAC002',
    factoryName: 'Aluminum Solutions',
    material: 'Aluminum 6061',
    size: '2440x1220',
    thickness: '4mm',
    qty: 30,
    unitCost: 95.00,
    totalCost: 2850.00,
    batchRef: 'BATCH-2024-002',
    notes: 'Aircraft grade aluminum'
  },
  {
    id: 'PUR003',
    date: '2024-02-01',
    factoryId: 'FAC001',
    factoryName: 'Steel Works Ltd',
    material: 'Mild Steel',
    size: '3000x1500',
    thickness: '5mm',
    qty: 40,
    unitCost: 120.00,
    totalCost: 4800.00,
    batchRef: 'BATCH-2024-003',
    notes: 'Heavy duty mild steel'
  }
];

// Sample Orders (with traceability)
const orders = [
  {
    'Order Ref': 'ORD001',
    Date: '2024-01-16',
    'Customer ID': 'CUST001',
    Customer: 'ABC Manufacturing',
    'Sheet ID': 'SHT001',
    'Purchase ID': 'PUR001',
    'Factory ID': 'FAC001',
    'Factory Name': 'Steel Works Ltd',
    'Batch Ref': 'BATCH-2024-001',
    Material: 'Stainless Steel',
    'Piece Size (mm)': '600x400',
    Qty: 10,
    'Area per Piece (m²)': 0.24,
    'Total Area Used (m²)': 2.4,
    'Unit Cost': 85.50,
    'Unit Sale Price': 125.00,
    'Total Cost': 855.00,
    'Total Sale': 1250.00,
    Profit: 395.00,
    'Leftover Area (m²)': 0.58,
    'Offcut Used? (Y/N)': 'N',
    'Sheet Used (Y/N)': 'Y',
    Notes: 'Custom cut for ABC Manufacturing'
  },
  {
    'Order Ref': 'ORD002',
    Date: '2024-01-22',
    'Customer ID': 'CUST002',
    Customer: 'XYZ Construction',
    'Sheet ID': 'SHT002',
    'Purchase ID': 'PUR002',
    'Factory ID': 'FAC002',
    'Factory Name': 'Aluminum Solutions',
    'Batch Ref': 'BATCH-2024-002',
    Material: 'Aluminum 6061',
    'Piece Size (mm)': '800x600',
    Qty: 15,
    'Area per Piece (m²)': 0.48,
    'Total Area Used (m²)': 7.2,
    'Unit Cost': 95.00,
    'Unit Sale Price': 140.00,
    'Total Cost': 1425.00,
    'Total Sale': 2100.00,
    Profit: 675.00,
    'Leftover Area (m²)': 1.25,
    'Offcut Used? (Y/N)': 'Y',
    'Sheet Used (Y/N)': 'Y',
    Notes: 'Reused leftover for smaller pieces'
  },
  {
    'Order Ref': 'ORD003',
    Date: '2024-02-05',
    'Customer ID': 'CUST003',
    Customer: 'Tech Solutions Inc',
    'Sheet ID': 'SHT003',
    'Purchase ID': 'PUR003',
    'Factory ID': 'FAC001',
    'Factory Name': 'Steel Works Ltd',
    'Batch Ref': 'BATCH-2024-003',
    Material: 'Mild Steel',
    'Piece Size (mm)': '1000x800',
    Qty: 8,
    'Area per Piece (m²)': 0.8,
    'Total Area Used (m²)': 6.4,
    'Unit Cost': 120.00,
    'Unit Sale Price': 165.00,
    'Total Cost': 960.00,
    'Total Sale': 1320.00,
    Profit: 360.00,
    'Leftover Area (m²)': 2.1,
    'Offcut Used? (Y/N)': 'N',
    'Sheet Used (Y/N)': 'Y',
    Notes: 'High precision cutting required'
  },
  {
    'Order Ref': 'ORD004',
    Date: '2024-02-10',
    'Customer ID': 'CUST001',
    Customer: 'ABC Manufacturing',
    'Sheet ID': 'SHT001',
    'Purchase ID': 'PUR001',
    'Factory ID': 'FAC001',
    'Factory Name': 'Steel Works Ltd',
    'Batch Ref': 'BATCH-2024-001',
    Material: 'Stainless Steel',
    'Piece Size (mm)': '500x300',
    Qty: 20,
    'Area per Piece (m²)': 0.15,
    'Total Area Used (m²)': 3.0,
    'Unit Cost': 85.50,
    'Unit Sale Price': 120.00,
    'Total Cost': 1710.00,
    'Total Sale': 2400.00,
    Profit: 690.00,
    'Leftover Area (m²)': 0.98,
    'Offcut Used? (Y/N)': 'N',
    'Sheet Used (Y/N)': 'Y',
    Notes: 'Standard order'
  }
];

// Create workbook
const workbook = XLSX.utils.book_new();

// Add sheets
const ordersSheet = XLSX.utils.json_to_sheet(orders);
XLSX.utils.book_append_sheet(workbook, ordersSheet, 'Orders');

const customersSheet = XLSX.utils.json_to_sheet(customers);
XLSX.utils.book_append_sheet(workbook, customersSheet, 'Customers');

const factoriesSheet = XLSX.utils.json_to_sheet(factories);
XLSX.utils.book_append_sheet(workbook, factoriesSheet, 'Factories');

const purchasesSheet = XLSX.utils.json_to_sheet(purchases);
XLSX.utils.book_append_sheet(workbook, purchasesSheet, 'Purchases');

// Write file
const outputPath = path.join(__dirname, '../public/SheetCuttingBusinessTemplate.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log('Excel file generated successfully at:', outputPath);
console.log('Sheets created:');
console.log('  - Orders (with traceability fields)');
console.log('  - Customers');
console.log('  - Factories');
console.log('  - Purchases');
console.log('\nSample data includes:');
console.log(`  - ${customers.length} customers`);
console.log(`  - ${factories.length} factories`);
console.log(`  - ${purchases.length} purchases`);
console.log(`  - ${orders.length} orders`);
